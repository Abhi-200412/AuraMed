from pathlib import Path
import random
import shutil

# =========================
# PATHS
# =========================
CT_ROOT = Path("dataset/ct")
ALL = CT_ROOT / "all"

NORMAL_SRC = ALL / "non-COVID"
ABNORMAL_SRC = ALL / "COVID"

TRAIN = CT_ROOT / "train" / "normal"
VAL = CT_ROOT / "val" / "normal"
TEST_NORMAL = CT_ROOT / "test" / "normal"
TEST_ABNORMAL = CT_ROOT / "test" / "abnormal"

# =========================
# CREATE DIRS
# =========================
for p in [TRAIN, VAL, TEST_NORMAL, TEST_ABNORMAL]:
    p.mkdir(parents=True, exist_ok=True)

# =========================
# LOAD FILES
# =========================
normal_files = list(NORMAL_SRC.glob("*.png"))
abnormal_files = list(ABNORMAL_SRC.glob("*.png"))

random.shuffle(normal_files)

# =========================
# SPLIT RATIOS
# =========================
train_ratio = 0.8
val_ratio = 0.1   # remaining → test

train_end = int(len(normal_files) * train_ratio)
val_end = int(len(normal_files) * (train_ratio + val_ratio))

train_files = normal_files[:train_end]
val_files = normal_files[train_end:val_end]
test_normal_files = normal_files[val_end:]

# =========================
# COPY FUNCTION
# =========================
def copy(files, dst):
    for f in files:
        shutil.copy(f, dst / f.name)

# =========================
# COPY FILES
# =========================
copy(train_files, TRAIN)
copy(val_files, VAL)
copy(test_normal_files, TEST_NORMAL)
copy(abnormal_files, TEST_ABNORMAL)

print("✅ CT dataset split completed")
print(f"Train normal: {len(train_files)}")
print(f"Val normal: {len(val_files)}")
print(f"Test normal: {len(test_normal_files)}")
print(f"Test abnormal: {len(abnormal_files)}")
