from monai.transforms import (
    Compose, LoadImaged, EnsureChannelFirstd,
    Spacingd, Orientationd, ScaleIntensityRanged,
    RandCropByPosNegLabeld, RandFlipd,
    EnsureTyped, SpatialPadd, RandSpatialCropd
)

def get_transforms(train=True):
    keys = ("image", "label")

    xforms = [
        LoadImaged(keys),
        EnsureChannelFirstd(keys),
        Orientationd(keys, axcodes="RAS"),
        Spacingd(
            keys,
            pixdim=(1.5, 1.5, 1.5),
            mode=("bilinear", "nearest")
        ),
        ScaleIntensityRanged(
            keys=["image"],
            a_min=-1000, a_max=400,
            b_min=0.0, b_max=1.0,
            clip=True
        ),
        # 🔥 THIS IS THE KEY FIX
        SpatialPadd(keys, spatial_size=(256, 256, 256)),
    ]

    if train:
        xforms += [
            RandSpatialCropd(
                keys,
                roi_size=(64, 64, 64),
                random_size=False
            )
        ]

    xforms += [EnsureTyped(keys)]
    return Compose(xforms)

