const apiURL = process.env.NEXT_PUBLIC_API_URL;
export const getUserProfileData = async (userID: string) => {
  try {
    const response = await fetch(`${apiURL}/users/userProfile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID,
      }),
    });
    if (!response.ok) {
      const data = await response.json();
      return {
        success: false,
        message: data,
      };
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }
};

export default getUserProfileData;
