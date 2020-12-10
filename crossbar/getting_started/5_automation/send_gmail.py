
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# =============================================================================
# Created By  : Jeromie Kirchoff
# Created Date: Mon Aug 02 17:46:00 PDT 2018
# =============================================================================
# Imports
# =============================================================================
import smtplib

def send_email(to_email,message,subject=""):
    # =============================================================================
    # SET EMAIL LOGIN REQUIREMENTS
    # =============================================================================
    gmail_user = 'anhhuy0501@gmail.com'
    gmail_app_password = 'cjshsfwfyxiezzrv'

    # =============================================================================
    # SET THE INFO ABOUT THE SAID EMAIL
    # =============================================================================
    sent_from = gmail_user
    sent_to = [to_email, to_email]
    sent_subject = subject
    sent_body = message

    email_text = """\
From: %s
To: %s
Subject: %s
    
%s\n
""" % (sent_from, ", ".join(sent_to), sent_subject, sent_body)

    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.ehlo()
        server.login(gmail_user, gmail_app_password)
        server.sendmail(sent_from, sent_to, email_text)
        server.close()

        print('Email sent!')
    except Exception as exception:
        print("Error: %s!\n\n" % exception)

if __name__ == '__main__':
    to_email = "anhhuy0501@gmail.com"
    message = ("Hey, what's up? friend!\n\n"
             "I hope you have been well!\n"
             "\n"
             "Cheers,\n"
             "Jay\n")
    subject = "Test mail"
    send_email(to_email, message, subject)
