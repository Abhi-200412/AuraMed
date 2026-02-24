import argparse, os
import torch
import torch.nn as nn
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
from model import load_densenet

def main(args):
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print("Using device:", device)

    train_dir = f"dataset/{args.dataset}/train"
    val_dir   = f"dataset/{args.dataset}/val"

    transform = transforms.Compose([
        transforms.Resize((224,224)),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485,0.456,0.406],
                             std=[0.229,0.224,0.225])
    ])

    train_ds = datasets.ImageFolder(train_dir, transform=transform)
    val_ds   = datasets.ImageFolder(val_dir, transform=transform)

    train_loader = DataLoader(train_ds, batch_size=16, shuffle=True)
    val_loader   = DataLoader(val_ds, batch_size=16, shuffle=False)

    model = load_densenet(num_classes=2)
    model = model.to(device)

    criterion = nn.CrossEntropyLoss().to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)

    for epoch in range(args.epochs):
        model.train()
        total, correct = 0, 0

        for x,y in train_loader:
            x,y = x.to(device), y.to(device)
            optimizer.zero_grad()
            out = model(x)
            loss = criterion(out, y)
            loss.backward()
            optimizer.step()

            _, pred = out.max(1)
            total += y.size(0)
            correct += pred.eq(y).sum().item()

        train_acc = 100 * correct / total

        model.eval()
        total, correct = 0, 0
        with torch.no_grad():
            for x,y in val_loader:
                x,y = x.to(device), y.to(device)
                out = model(x)
                _, pred = out.max(1)
                total += y.size(0)
                correct += pred.eq(y).sum().item()

        val_acc = 100 * correct / total
        print(f"Epoch {epoch+1}: Train Acc {train_acc:.2f} | Val Acc {val_acc:.2f}")

    os.makedirs("backend/models", exist_ok=True)
    torch.save(model.state_dict(),
               f"backend/models/densenet_{args.dataset}.pth")

    print("Model saved.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", required=True,
                        choices=["xray", "mri"])
    parser.add_argument("--epochs", type=int, default=5)
    args = parser.parse_args()
    main(args)
import argparse, os
import torch
import torch.nn as nn
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
from model import load_densenet


def evaluate(model, loader, device):
    model.eval()
    total, correct = 0, 0
    with torch.no_grad():
        for x, y in loader:
            x, y = x.to(device), y.to(device)
            out = model(x)
            _, pred = out.max(1)
            total += y.size(0)
            correct += pred.eq(y).sum().item()
    return 100 * correct / total


def main(args):
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print("Using device:", device)

    base_dir = f"dataset/{args.dataset}"

    train_dir = f"{base_dir}/train"
    val_dir   = f"{base_dir}/val"
    test_dir  = f"{base_dir}/test"

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
    ])

    train_ds = datasets.ImageFolder(train_dir, transform=transform)
    val_ds   = datasets.ImageFolder(val_dir, transform=transform)
    test_ds  = datasets.ImageFolder(test_dir, transform=transform)

    train_loader = DataLoader(train_ds, batch_size=16, shuffle=True)
    val_loader   = DataLoader(val_ds, batch_size=16, shuffle=False)
    test_loader  = DataLoader(test_ds, batch_size=16, shuffle=False)

    model = load_densenet(num_classes=2).to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)

    best_val_acc = 0.0

    for epoch in range(args.epochs):
        model.train()
        total, correct = 0, 0

        for x, y in train_loader:
            x, y = x.to(device), y.to(device)

            optimizer.zero_grad()
            out = model(x)
            loss = criterion(out, y)
            loss.backward()
            optimizer.step()

            _, pred = out.max(1)
            total += y.size(0)
            correct += pred.eq(y).sum().item()

        train_acc = 100 * correct / total
        val_acc = evaluate(model, val_loader, device)

        print(
            f"Epoch {epoch+1}/{args.epochs} | "
            f"Train Acc: {train_acc:.2f}% | "
            f"Val Acc: {val_acc:.2f}%"
        )

        # Save best model based on validation accuracy
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            os.makedirs("backend/models", exist_ok=True)
            torch.save(
                model.state_dict(),
                f"backend/models/densenet_{args.dataset}.pth"
            )

    print(f"\nBest Validation Accuracy: {best_val_acc:.2f}%")

    # 🔥 Final unbiased evaluation
    test_acc = evaluate(model, test_loader, device)
    print(f"Final Test Accuracy: {test_acc:.2f}%")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--dataset",
        required=True,
        choices=["xray", "mri"]
    )
    parser.add_argument(
        "--epochs",
        type=int,
        default=10
    )
    args = parser.parse_args()
    main(args)
