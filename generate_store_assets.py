"""Generate all Google Play Store assets for Color Sort Puzzle."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os, math

OUT = "store_assets"
ICON_DIR = "public/icons"
os.makedirs(OUT, exist_ok=True)
os.makedirs(ICON_DIR, exist_ok=True)

# Colors
BALL_COLORS = [
    (255, 68, 68),    # Red
    (68, 136, 255),   # Blue
    (68, 187, 68),    # Green
    (255, 204, 0),    # Yellow
    (170, 68, 255),   # Purple
    (255, 136, 68),   # Orange
    (255, 102, 170),  # Pink
    (68, 221, 221),   # Cyan
]

BG_DARK = (10, 10, 26)
BG_MID = (15, 24, 50)
BG_LIGHT = (20, 35, 70)

def draw_gradient_bg(draw, w, h):
    """Draw a space-like gradient background."""
    for y in range(h):
        r = int(BG_DARK[0] + (BG_LIGHT[0] - BG_DARK[0]) * y / h)
        g = int(BG_DARK[1] + (BG_LIGHT[1] - BG_DARK[1]) * y / h)
        b = int(BG_DARK[2] + (BG_LIGHT[2] - BG_DARK[2]) * y / h)
        draw.line([(0, y), (w, y)], fill=(r, g, b))

def draw_stars(draw, w, h, count=60):
    """Draw random stars."""
    import random
    random.seed(42)
    for _ in range(count):
        x = random.randint(0, w)
        y = random.randint(0, h)
        s = random.randint(1, 3)
        a = random.randint(100, 255)
        draw.ellipse([x, y, x+s, y+s], fill=(255, 255, 255, a))

def draw_ball(draw, cx, cy, radius, color):
    """Draw a 3D glossy ball."""
    r, g, b = color
    # Shadow
    draw.ellipse([cx-radius+3, cy-radius+3, cx+radius+3, cy+radius+3],
                 fill=(0, 0, 0, 80))
    # Main ball
    draw.ellipse([cx-radius, cy-radius, cx+radius, cy+radius],
                 fill=color)
    # Darker bottom
    dr, dg, db = max(0, r-60), max(0, g-60), max(0, b-60)
    draw.arc([cx-radius, cy-radius, cx+radius, cy+radius],
             start=30, end=150, fill=(dr, dg, db), width=max(2, radius//4))
    # Highlight
    hr, hg, hb = min(255, r+80), min(255, g+80), min(255, b+80)
    hs = radius * 0.4
    draw.ellipse([cx-hs, cy-radius*0.6, cx+hs*0.3, cy-radius*0.15],
                 fill=(hr, hg, hb, 180))
    # White shine spot
    ss = radius * 0.2
    draw.ellipse([cx-radius*0.3-ss, cy-radius*0.4-ss,
                  cx-radius*0.3+ss, cy-radius*0.4+ss],
                 fill=(255, 255, 255, 200))

def draw_tube(draw, cx, top_y, width, height, balls=None, ball_radius=None):
    """Draw a glass tube with balls."""
    hw = width // 2
    r = hw  # bottom curve radius

    # Tube body (semi-transparent)
    # Left side
    draw.line([(cx-hw, top_y), (cx-hw, top_y+height-r)], fill=(255,255,255,60), width=2)
    # Right side
    draw.line([(cx+hw, top_y), (cx+hw, top_y+height-r)], fill=(255,255,255,60), width=2)
    # Bottom arc
    draw.arc([cx-hw, top_y+height-2*r, cx+hw, top_y+height],
             start=0, end=180, fill=(255,255,255,60), width=2)

    # Rim at top
    draw.rectangle([cx-hw-4, top_y-6, cx+hw+4, top_y+2],
                   fill=(150, 170, 200, 100), outline=(200, 210, 230, 120), width=1)

    # Glass reflection (left)
    draw.line([(cx-hw+4, top_y+10), (cx-hw+4, top_y+height-r-10)],
             fill=(255,255,255,40), width=2)

    # Balls
    if balls and ball_radius:
        for i, color_idx in enumerate(balls):
            by = top_y + height - r - ball_radius - i * (ball_radius * 2 + 4)
            draw_ball(draw, cx, by, ball_radius, BALL_COLORS[color_idx % len(BALL_COLORS)])

def try_font(size):
    """Try to load a bold font."""
    for name in ["arialbd.ttf", "Arial Bold.ttf", "DejaVuSans-Bold.ttf", "arial.ttf", "FreeSansBold.ttf"]:
        try:
            return ImageFont.truetype(name, size)
        except:
            pass
    return ImageFont.load_default()

# ============================================================
# 1. APP ICONS
# ============================================================
def generate_icon(size, maskable=False):
    """Generate app icon at given size."""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img, 'RGBA')

    padding = int(size * 0.1) if maskable else 0
    inner = size - padding * 2

    # Rounded rect background
    corner = int(size * 0.18) if not maskable else 0
    draw.rounded_rectangle([0, 0, size-1, size-1], radius=corner,
                          fill=BG_MID)

    # Gradient overlay
    for y in range(size):
        alpha = int(40 * y / size)
        draw.line([(0, y), (size, y)], fill=(0, 0, 0, alpha))

    # Draw 3 tubes with balls
    tube_w = int(inner * 0.14)
    tube_h = int(inner * 0.5)
    ball_r = int(inner * 0.055)
    spacing = int(inner * 0.24)
    start_x = size // 2 - spacing
    start_y = padding + int(inner * 0.28)

    tube_configs = [
        [0, 0, 1, 3],  # Red, Red, Blue, Yellow
        [1, 3, 2, 2],  # Blue, Yellow, Green, Green
        [3, 2, 0, 1],  # Yellow, Green, Red, Blue
    ]

    for t in range(3):
        tx = start_x + t * spacing
        draw_tube(draw, tx, start_y, tube_w, tube_h, tube_configs[t], ball_r)

    # Title "CS" at top
    font_size = int(inner * 0.12)
    font = try_font(font_size)
    draw.text((size//2, padding + int(inner * 0.14)), "CS",
              fill=(255, 255, 255, 230), font=font, anchor="mm")

    return img

print("Generating icons...")
for s in [48, 72, 96, 144, 192, 512]:
    icon = generate_icon(s)
    icon.save(f"{ICON_DIR}/icon-{s}.png")
    if s in (192, 512):
        maskable = generate_icon(s, maskable=True)
        maskable.save(f"{ICON_DIR}/icon-maskable-{s}.png")
    print(f"  icon-{s}.png")

# Also save 512 icon for Play Store
generate_icon(512).save(f"{OUT}/icon_512.png")
print("  store icon_512.png")

# ============================================================
# 2. FEATURE GRAPHIC (1024x500)
# ============================================================
def generate_feature_graphic():
    w, h = 1024, 500
    img = Image.new('RGBA', (w, h))
    draw = ImageDraw.Draw(img, 'RGBA')

    draw_gradient_bg(draw, w, h)
    draw_stars(draw, w, h, 40)

    # Decorative balls scattered
    import random
    random.seed(99)
    for _ in range(12):
        bx = random.randint(50, w-50)
        by = random.randint(50, h-50)
        br = random.randint(15, 30)
        bc = random.randint(0, 7)
        draw_ball(draw, bx, by, br, BALL_COLORS[bc])

    # Title text
    title_font = try_font(64)
    sub_font = try_font(28)

    # Title shadow
    draw.text((w//2+2, h//2 - 30+2), "Color Sort Puzzle",
              fill=(0, 0, 0, 150), font=title_font, anchor="mm")
    draw.text((w//2, h//2 - 30), "Color Sort Puzzle",
              fill=(255, 255, 255), font=title_font, anchor="mm")

    # Tagline
    draw.text((w//2, h//2 + 40), "Sort  ·  Solve  ·  Relax",
              fill=(200, 200, 255, 200), font=sub_font, anchor="mm")

    return img.convert('RGB')

print("\nGenerating feature graphic...")
generate_feature_graphic().save(f"{OUT}/feature_graphic_1024x500.png")
print("  feature_graphic_1024x500.png")

# ============================================================
# 3. SCREENSHOTS (1080x1920)
# ============================================================
def make_screenshot_base():
    """Create base screenshot with background."""
    w, h = 1080, 1920
    img = Image.new('RGBA', (w, h))
    draw = ImageDraw.Draw(img, 'RGBA')
    draw_gradient_bg(draw, w, h)
    draw_stars(draw, w, h, 100)
    return img, draw

def add_caption(draw, w, text, subtitle=None):
    """Add caption text at top of screenshot."""
    font = try_font(56)
    sub_font = try_font(32)

    # Caption background bar
    draw.rectangle([0, 0, w, 180], fill=(40, 20, 80, 200))
    draw.text((w//2, 70), text, fill=(255, 255, 255), font=font, anchor="mm")
    if subtitle:
        draw.text((w//2, 130), subtitle, fill=(200, 200, 255, 180), font=sub_font, anchor="mm")

def add_bottom_banner(draw, w, h, text):
    """Add purple banner at bottom."""
    banner_h = 140
    draw.rectangle([0, h-banner_h, w, h], fill=(80, 30, 120))
    draw.rectangle([0, h-banner_h, w, h-banner_h+4], fill=(140, 60, 200))
    font = try_font(48)
    draw.text((w//2, h - banner_h//2), text, fill=(255, 255, 255), font=font, anchor="mm")

# Screenshot 1: Home Screen
def screenshot_home():
    img, draw = make_screenshot_base()
    w, h = 1080, 1920

    add_caption(draw, w, "Color Sort Puzzle", "Addictive Ball Sorting Game!")

    # Bouncing balls
    for i, c in enumerate(range(5)):
        bx = 300 + i * 120
        by = 500 + (20 if i % 2 == 0 else 0)
        draw_ball(draw, bx, by, 40, BALL_COLORS[c])

    # Title
    title_font = try_font(72)
    draw.text((w//2, 650), "Color Sort", fill=(255, 255, 255), font=title_font, anchor="mm")
    draw.text((w//2, 740), "Puzzle", fill=(255, 255, 255), font=title_font, anchor="mm")

    sub_font = try_font(28)
    draw.text((w//2, 810), "Sort the balls into matching tubes!", fill=(200, 200, 255, 150), font=sub_font, anchor="mm")

    # Play button
    draw.rounded_rectangle([280, 900, 800, 990], radius=25, fill=(59, 130, 246))
    btn_font = try_font(36)
    draw.text((540, 945), "▶  Play (Level 1)", fill=(255, 255, 255), font=btn_font, anchor="mm")

    # Other buttons
    draw.rounded_rectangle([280, 1020, 800, 1090], radius=25, fill=(40, 40, 70), outline=(255,255,255,40))
    draw.text((540, 1055), "📋  Select Level", fill=(220, 220, 220), font=try_font(30), anchor="mm")

    draw.rounded_rectangle([280, 1120, 800, 1190], radius=25, fill=(40, 40, 70), outline=(255,255,255,40))
    draw.text((540, 1155), "⚙️  Settings", fill=(220, 220, 220), font=try_font(30), anchor="mm")

    add_bottom_banner(draw, w, h, "FREE TO PLAY")
    return img.convert('RGB')

# Screenshot 2: Easy gameplay (4 colors, 6 tubes)
def screenshot_gameplay_easy():
    img, draw = make_screenshot_base()
    w, h = 1080, 1920

    add_caption(draw, w, "Easy Mode", "4 Colors · 6 Tubes")

    # Top bar
    bar_font = try_font(32)
    draw.text((w//2, 260), "Level 3", fill=(255, 220, 150), font=try_font(40), anchor="mm")
    draw.text((w//2, 310), "Moves: 5", fill=(255, 255, 255, 150), font=try_font(24), anchor="mm")

    # 6 tubes in 2 rows of 3
    tube_w = 80
    tube_h = 320
    ball_r = 32
    configs = [
        [0, 0, 1, 3],
        [1, 3, 2],
        [0, 2, 3],
        [2, 1, 0, 2],
        [3, 1],
        [],  # empty
    ]

    for row in range(2):
        for col in range(3):
            idx = row * 3 + col
            tx = 230 + col * 240
            ty = 420 + row * 480
            draw_tube(draw, tx, ty, tube_w, tube_h, configs[idx], ball_r)

    # Bottom bar buttons
    btn_y = 1500
    labels = ["↩️ Undo", "💡 Hint", "➕ +1 Tube", "🔄 Restart"]
    for i, label in enumerate(labels):
        bx = 150 + i * 220
        draw.rounded_rectangle([bx-70, btn_y, bx+70, btn_y+70], radius=15,
                              fill=(40, 40, 70), outline=(255,255,255,30))
        draw.text((bx, btn_y+35), label, fill=(200, 200, 220), font=try_font(16), anchor="mm")

    add_bottom_banner(draw, w, h, "SORT BALLS")
    return img.convert('RGB')

# Screenshot 3: Hard gameplay (8 colors)
def screenshot_gameplay_hard():
    img, draw = make_screenshot_base()
    w, h = 1080, 1920

    add_caption(draw, w, "Hard Mode", "8 Colors · 10 Tubes")

    draw.text((w//2, 260), "Level 95", fill=(255, 220, 150), font=try_font(40), anchor="mm")
    draw.text((w//2, 310), "Moves: 23", fill=(255, 255, 255, 150), font=try_font(24), anchor="mm")

    tube_w = 60
    tube_h = 260
    ball_r = 24

    configs = [
        [0, 3, 5, 7], [1, 4, 6, 2], [2, 0, 7, 3],
        [3, 5, 1, 6], [4, 2, 0, 5],
        [5, 7, 3, 1], [6, 0, 4, 2], [7, 6, 1, 4],
        [3, 5],       [],
    ]

    for row in range(2):
        for col in range(5):
            idx = row * 5 + col
            if idx >= len(configs):
                break
            tx = 160 + col * 180
            ty = 400 + row * 400
            draw_tube(draw, tx, ty, tube_w, tube_h, configs[idx], ball_r)

    add_bottom_banner(draw, w, h, "CHALLENGE YOUR BRAIN")
    return img.convert('RGB')

# Screenshot 4: Level Complete
def screenshot_level_complete():
    img, draw = make_screenshot_base()
    w, h = 1080, 1920

    add_caption(draw, w, "Level Complete!", "Earn Stars & Coins")

    # Completed tubes in background (faded)
    tube_w = 70
    tube_h = 280
    ball_r = 28
    for col in range(4):
        tx = 200 + col * 180
        ty = 350
        draw_tube(draw, tx, ty, tube_w, tube_h, [col, col, col, col], ball_r)

    # Victory modal overlay
    draw.rounded_rectangle([140, 750, 940, 1350], radius=30, fill=(26, 37, 80))
    draw.rectangle([140, 750, 940, 754], fill=(60, 80, 150))

    modal_font = try_font(48)
    draw.text((540, 820), "Level Complete!", fill=(255, 255, 255), font=modal_font, anchor="mm")
    draw.text((540, 890), "🎉", fill=(255, 255, 255), font=try_font(64), anchor="mm")

    # Stars
    star_font = try_font(60)
    draw.text((540, 990), "⭐  ⭐  ⭐", fill=(255, 200, 0), font=star_font, anchor="mm")

    # Coin reward
    draw.rounded_rectangle([380, 1060, 700, 1110], radius=20, fill=(60, 50, 20))
    draw.text((540, 1085), "🪙 +55 Coins", fill=(255, 200, 50), font=try_font(28), anchor="mm")

    # Buttons
    draw.rounded_rectangle([200, 1170, 480, 1250], radius=20, fill=(40, 40, 70), outline=(255,255,255,40))
    draw.text((340, 1210), "Replay", fill=(220, 220, 220), font=try_font(32), anchor="mm")

    draw.rounded_rectangle([520, 1170, 880, 1250], radius=20, fill=(59, 130, 246))
    draw.text((700, 1210), "Next Level →", fill=(255, 255, 255), font=try_font(32), anchor="mm")

    add_bottom_banner(draw, w, h, "500+ LEVELS")
    return img.convert('RGB')

# Screenshot 5: Level Select
def screenshot_level_select():
    img, draw = make_screenshot_base()
    w, h = 1080, 1920

    add_caption(draw, w, "Level Select", "Track Your Progress")

    # Grid of level buttons
    cols, rows = 5, 8
    cell_size = 130
    start_x = (w - cols * cell_size) // 2
    start_y = 300

    import random
    random.seed(77)
    for row in range(rows):
        for col in range(cols):
            level = row * cols + col + 1
            cx = start_x + col * cell_size + cell_size // 2
            cy = start_y + row * cell_size + cell_size // 2

            unlocked = level <= 25
            fill = (40, 40, 70) if unlocked else (20, 20, 40)
            outline = (255, 255, 255, 40) if unlocked else (255, 255, 255, 15)

            draw.rounded_rectangle([cx-50, cy-50, cx+50, cy+50], radius=15,
                                  fill=fill, outline=outline)
            color = (255, 255, 255) if unlocked else (100, 100, 100)
            draw.text((cx, cy-8), str(level), fill=color, font=try_font(28), anchor="mm")

            if unlocked and level <= 20:
                stars = random.choice([1, 2, 3, 3, 3, 2])
                star_text = "⭐" * stars
                draw.text((cx, cy+25), star_text, fill=(255, 200, 0), font=try_font(12), anchor="mm")
            elif not unlocked:
                draw.text((cx, cy+20), "🔒", font=try_font(16), anchor="mm")

    add_bottom_banner(draw, w, h, "ENDLESS FUN")
    return img.convert('RGB')

print("\nGenerating screenshots...")
screenshots = [
    ("screenshot_1_home.png", screenshot_home),
    ("screenshot_2_easy.png", screenshot_gameplay_easy),
    ("screenshot_3_hard.png", screenshot_gameplay_hard),
    ("screenshot_4_complete.png", screenshot_level_complete),
    ("screenshot_5_levels.png", screenshot_level_select),
]

for filename, func in screenshots:
    func().save(f"{OUT}/{filename}", quality=95)
    print(f"  {filename}")

print(f"\n✅ All assets saved to '{OUT}/' and '{ICON_DIR}/'")
print(f"\nFiles generated:")
for f in sorted(os.listdir(OUT)):
    size = os.path.getsize(f"{OUT}/{f}")
    print(f"  {f} ({size//1024}KB)")
