from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import hash_password

db = SessionLocal()

# Update existing user
phone = "+919601089404"
new_password = "admin123"  # Change this to your desired password

user = db.query(User).filter(User.phone == phone).first()
if user:
    user.password_hash = hash_password(new_password)
    user.role = "admin"
    db.commit()
    print(f"Password reset for {user.name}")
    print(f"Role set to: {user.role}")
    print(f"\nLogin with:")
    print(f"  Phone: {phone}")
    print(f"  Password: {new_password}")
else:
    print(f"User {phone} not found")

db.close()
