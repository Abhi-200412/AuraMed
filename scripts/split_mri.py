from pathlib import Path
import random, shutil

SRC = Path("dataset/mri/all")
DST = Path("dataset/mri")

for cls in ["normal", "abnormal"]:
    files = list((SRC/cls).glob("*"))
    random.shuffle(files)
    split = int(len(files)*0.8)

    for f in files[:split]:
        out = DST/"train"/cls
        out.mkdir(parents=True, exist_ok=True)
        shutil.copy(f, out/f.name)

    for f in files[split:]:
        out = DST/"val"/cls
        out.mkdir(parents=True, exist_ok=True)
        shutil.copy(f, out/f.name)

print("MRI split done.")
import random
import shutil
from pathlib import Path

# CONFIG
SOURCE = Path("dataset/mri/all")
DEST   = Path("dataset/mri")

SPLIT = {
    "train": 0.7,
    "val":   0.15,
    "test":  0.15
}

random.seed(42)

print("Source:", SOURCE.resolve())

for cls in ["normal", "abnormal"]:
    class_dir = SOURCE / cls
    print("Checking:", class_dir.resolve())

    if not class_dir.exists():
        print(f"❌ Missing folder: {class_dir}")
        continue

    files = list(class_dir.glob("*"))
    print(f"Found {len(files)} files in '{cls}'")

    if len(files) == 0:
        continue

    random.shuffle(files)

    n = len(files)
    train_end = int(SPLIT["train"] * n)
    val_end   = train_end + int(SPLIT["val"] * n)

    splits = {
        "train": files[:train_end],
        "val":   files[train_end:val_end],
        "test":  files[val_end:]
    }

    for split, split_files in splits.items():
        out_dir = DEST / split / cls
        out_dir.mkdir(parents=True, exist_ok=True)

        for f in split_files:
            shutil.copy(f, out_dir / f.name)

print("✅ X-ray dataset split complete (train / val / test).")
