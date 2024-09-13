
const serviceAccountKey = {
    "type": "service_account",
    "project_id": "college-central-website",
    "private_key_id": process.env.REACT_FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.REACT_FIREBASE_PRIVATE_KEY,
    "client_email": "firebase-adminsdk-owwn4@college-central-website.iam.gserviceaccount.com",
    "client_id": process.env.REACT_FIREBASE_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-owwn4%40college-central-website.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
  };
  
  export default serviceAccountKey;
  