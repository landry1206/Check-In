from validate_email_address import validate_email

def email_exists(email: str) -> bool:
    return validate_email(email)
