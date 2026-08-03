# User Manual

Welcome to SecureShare! This guide will walk you through the end-to-end process of securely sharing a file.

## 1. Account Creation & Key Setup
1. Navigate to the application homepage and click **Register**.
2. Enter your desired Username, Email, and Password.
3. Upon successful registration, you will be prompted to generate your **Encryption Keys**. Click the generate button. *Your private key is stored locally in your browser to decrypt files sent to you.*

## 2. Sending a File
1. Log in and navigate to the **Upload** page.
2. Select the file you wish to share (e.g., a PDF, image, or text document).
3. Type the exactly username of the person you want to send the file to in the **Recipient Username** field.
4. Set an expiration time (e.g., 24 hours).
5. Click **Upload and Encrypt**.
6. The system will provide you with a secure share link and a **QR Code**.

## 3. Sharing via QR Code
If your recipient is standing next to you, they can simply point their smartphone camera at the generated **QR Code** on your screen. This will instantly route them to the download page on their device.

## 4. Receiving and Decrypting a File
1. If you were sent a link, click it. (Alternatively, if you log in, you will see a notification on your Dashboard under the "Received Transmissions" tab).
2. The page will verify the status of the file (ensuring it hasn't expired or been downloaded already).
3. Click **Decrypt and Download**. 
4. The system will use your private key to securely unwrap the payload, and the file will download directly to your machine.
5. *Note: If anyone tries to click that link again, it will be rejected as it is a One-Time Use link.*

## 5. Dashboard Tracking
You can view your history by clicking **Dashboard** in the navigation bar.
- **Sent Transmissions**: Shows files you uploaded. If you made a mistake, you can click the red **Delete** button to instantly revoke access before the recipient downloads it.
- **Received Transmissions**: Shows a history of files sent to you, and whether you have successfully decrypted them yet.
