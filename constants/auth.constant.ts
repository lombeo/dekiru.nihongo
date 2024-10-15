const ORIGIN = process.env.NEXT_PUBLIC_BASE_URL;

const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
const GITHUB_REDIRECT_URI = ORIGIN + "/oauth/github";
export const GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&response_type=code`;

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = ORIGIN + `/oauth/google`;
export const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?
scope=email&openid.realm&
include_granted_scopes=true&
response_type=token&
state=state_parameter_passthrough_value&
redirect_uri=
${GOOGLE_REDIRECT_URI}&
client_id=${GOOGLE_CLIENT_ID}`;
