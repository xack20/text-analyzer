import secrets

def generate_secret(length=50):
    # Generate a secure random URL-safe text string
    return secrets.token_urlsafe(length)

# Generate a session secret
session_secret = generate_secret()
print(session_secret)
