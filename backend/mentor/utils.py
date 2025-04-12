import qrcode
import uuid
import base64
from io import BytesIO
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils import timezone
from datetime import timedelta
from .models import MentorQRLoginToken


def generate_qr_token(mentor):
    """Generate a unique token and create QR login token for a mentor"""
    # Generate a unique token
    token = str(uuid.uuid4())
    
    # Set expiration to 30 days from now
    expiry_date = timezone.now() + timedelta(days=30)
    
    # Create or update QR login token
    qr_token, created = MentorQRLoginToken.objects.update_or_create(
        mentor=mentor,
        defaults={
            'token': token,
            'is_active': True,
            'expires_at': expiry_date
        }
    )
    
    return qr_token

def generate_qr_code_image(token):
    """Generate QR code image for the given token"""
    # Create QR code instance
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    
    # Add the token data
    qr.add_data(token)
    qr.make(fit=True)
    
    # Create an image from the QR Code
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Save the image to a BytesIO object
    buffer = BytesIO()
    img.save(buffer)
    buffer.seek(0)
    
    # Encode the image as base64 string
    img_str = base64.b64encode(buffer.getvalue()).decode()
    
    return img_str

def send_qr_code_email(mentor, qr_image_base64):
    """Send email with QR code to mentor"""
    subject = f"Your Login QR Code - {mentor.college.college_name if mentor.college else 'Mentor Portal'}"
    
    # Prepare HTML content
    html_content = render_to_string(
        'mentor/email/qr_code_email.html',
        {
            'mentor_name': mentor.full_name or mentor.user.username,
            'qr_code_image': qr_image_base64,
            'college_name': mentor.college.college_name if mentor.college else 'Mentor Portal',
            'expiry_days': 30
        }
    )
    
    # Create and send email
    email = EmailMessage(
        subject,
        html_content,
        'crce.secea.10223@gmail.com',  # From email
        [mentor.user.email],  # To email
    )
    email.content_subtype = "html"  # Set email format to HTML
    
    return email.send()
