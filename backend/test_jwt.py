from oauth2 import create_access_token, verify_access_token

token = create_access_token(
    {"user_id": 1}
)

print("TOKEN:")
print(token)

print("\nUSER ID:")
print(verify_access_token(token))