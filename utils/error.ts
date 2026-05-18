const NOTFOUND = ["POSITION_NOT_FOUND", "ORDER_NOT_FOUND"];
const FAILED_TO_SEND_EMAIL = ["COULD_NOT_SEND_EMAIL", "COULD_NOT_RESEND_EMAIL"];
const SECURITY_FAILED = ["Not authenticated", "LOST_VERIFICATION_FAILED"];
export const errorMessages = (error: any) => {
  if (!error?.data) {
    return "An unexpected error occurred. Please try again.";
  }

  const data = error.data;
  let message = `An unexpected error occurred. Please try again. [${data}]`;
  switch (data?.code) {
    case "ERROR_APPS":
      message = "An error occurred with the application. Please try again.";
      break;
    case error === "WALLET_ORDER_MULTIPLIER_TOO_LOW":
      message = `Your wallet balance is too low to set volume multiplier. Please top up your wallet and try again.`;
      break;
    case error === "POSITION_NOT_FOUND":
      message = `Position not found. Please check the position information and try again.`;
      break;
    case error === "PASSWORD_MISSMATCH":
      message = `Password wrong. Please check your password and try again.`;
      break;
    case SECURITY_FAILED.includes(error):
      message = `Verification failed. Please check the information you provided and try again.`;
      break;
    case NOTFOUND.includes(error):
      message = `No Data Found`;
      break;
    case error === "ORDER_CAPACITY_PREVIEW_WRONG_VALUE":
      message = `Cannot Create / Update Services, Capacity for these services is not enough. Please adjust the settings and try again. If you are creating new services, please check under advanced options and adjust the capacity preview.`;
      break;
    case error === "USER_NOT_EXIST":
      message = `User not found. Please check the user information and try again.`;
      break;
    case FAILED_TO_SEND_EMAIL.includes(error):
      message = `Failed to send email, Please contact our support. error: [ ${error} ]`;
      break;
    case error === "ERR_NETWORK":
      message =
        "Problem with your connection. Please check your internet connection and try again.";
      break;
    case error === "REFERRAL_NOT_FOUND":
      message =
        "Referral code not found. Please check your referral code and try again.";
      break;
  }

  return message;
};
