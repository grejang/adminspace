"""
update_admin.py
Modifica admins.json e genera le icone PNG degli admin.

USO:
  python update_admin.py --unicode u2447 --new-symbol 2665
  python update_admin.py --unicode u2447 --new-code NUOVOCODE
  python update_admin.py --add --code NUOVOCODE --unicode u1234 --symbol ሴ
  python update_admin.py --remove --unicode u2447

DIPENDENZE:
  pip install Pillow

ICONE:
  Le icone vengono salvate in admins/ con nome uguale all'unicode (es. admins/u2447.png)
  Sfondo bianco, simbolo unicode centrato, dimensione 64x64px
"""

import json
import argparse
import os
import sys

# ─── CONFIGURAZIONE ────────────────────────────────────────────────────────
ADMINS_FILE  = 'admins.json'
ICONS_FOLDER = 'admins'
ICON_SIZE    = 16
FONT_SIZE    = 12
SCALE_TO     = 256
# ───────────────────────────────────────────────────────────────────────────

def carica():
    with open(ADMINS_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def salva(data):
    with open(ADMINS_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f'✔ {ADMINS_FILE} aggiornato')

def genera_icona(unicode_id, symbol):
    try:
        from PIL import Image, ImageDraw, ImageFont
    except ImportError:
        print('⚠ Pillow non installato — icona non generata. Esegui: pip install Pillow')
        return

    os.makedirs(ICONS_FOLDER, exist_ok=True)

    img  = Image.new('RGBA', (ICON_SIZE, ICON_SIZE), (255, 255, 255, 255))
    draw = ImageDraw.Draw(img)

    # Prova a usare un font di sistema che supporti Unicode
    font = None
    font_paths = [
        'C:/Windows/Fonts/seguiemj.ttf',  
        'C:/Windows/Fonts/arial.ttf'
    ]
    for fp in font_paths:
        if os.path.exists(fp):
            try:
                from PIL import ImageFont
                font = ImageFont.truetype(fp, FONT_SIZE)
                break
            except:
                continue

    if font is None:
        from PIL import ImageFont
        font = ImageFont.load_default()

    # Centra il simbolo
    bbox = draw.textbbox((0, 0), symbol, font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    x = (ICON_SIZE - w) / 2 - bbox[0]
    y = (ICON_SIZE - h) / 2 - bbox[1]

    draw.text((x, y), symbol, fill=(0, 0, 0, 255), font=font)
    img = img.resize((SCALE_TO, SCALE_TO), Image.NEAREST)  # NEAREST mantiene i pixel netti

    path = os.path.join(ICONS_FOLDER, unicode_id + '.png')
    img.save(path)
    
    print(f'✔ Icona generata: {path}')

def trova(data, unicode_id):
    for a in data['admins']:
        if a['unicode'] == unicode_id:
            return a
    return None

# ─── ARGOMENTI ────────────────────────────────────────────────────────────
parser = argparse.ArgumentParser(description='Gestione AdminCodes')
parser.add_argument('--unicode',     help='Unicode dell\'admin da modificare (es. u2447)')
parser.add_argument('--new-symbol',  help='Nuovo simbolo Unicode (es. 2665)')
parser.add_argument('--new-code',    help='Nuovo AdminCode')
parser.add_argument('--add',         action='store_true', help='Aggiungi un nuovo admin')
parser.add_argument('--remove',      action='store_true', help='Rimuovi un admin')
parser.add_argument('--code',        help='AdminCode (per --add)')
parser.add_argument('--symbol',      help='Simbolo (per --add)')
args = parser.parse_args()

data = carica()

# ─── AGGIUNGI ─────────────────────────────────────────────────────────────
if args.add:
    if not args.code or not args.unicode or not args.symbol:
        print('❌ --add richiede --code, --unicode e --symbol')
        sys.exit(1)
    if trova(data, args.unicode):
        print(f'❌ Unicode {args.unicode} già esistente')
        sys.exit(1)
    data['admins'].append({
        'code':    args.code,
        'unicode': args.unicode,
        'symbol':  args.symbol
    })
    salva(data)
    genera_icona(args.unicode, args.symbol)

# ─── RIMUOVI ──────────────────────────────────────────────────────────────
elif args.remove:
    if not args.unicode:
        print('❌ --remove richiede --unicode')
        sys.exit(1)
    before = len(data['admins'])
    data['admins'] = [a for a in data['admins'] if a['unicode'] != args.unicode]
    if len(data['admins']) == before:
        print(f'❌ Unicode {args.unicode} non trovato')
        sys.exit(1)
    salva(data)
    print(f'✔ Admin {args.unicode} rimosso')

# ─── MODIFICA ─────────────────────────────────────────────────────────────
elif args.unicode:
    admin = trova(data, args.unicode)
    if not admin:
        print(f'❌ Unicode {args.unicode} non trovato')
        sys.exit(1)

    if args.new_symbol:
        # Converti codice hex in carattere
        try:
            new_char = chr(int(args.new_symbol, 16))
        except ValueError:
            print('❌ --new-symbol deve essere un codice hex (es. 2665)')
            sys.exit(1)
        new_unicode = 'u' + args.new_symbol.lower()
        admin['symbol']  = new_char
        admin['unicode'] = new_unicode
        salva(data)
        genera_icona(new_unicode, new_char)

    if args.new_code:
        admin['code'] = args.new_code
        salva(data)
        print(f'✔ AdminCode di {args.unicode} aggiornato')

else:
    parser.print_help()
