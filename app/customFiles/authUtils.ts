import AsyncStorage from "@react-native-async-storage/async-storage";

export const setAuthState = async (isAuthenticated: boolean) => {
  try {
    await AsyncStorage.setItem(
      "isAuthenticated",
      JSON.stringify(isAuthenticated)
    );
  } catch (error) {
    console.error("Error storing authentication state:", error);
  }
};

export const checkAuthState = async () => {
  try {
    const value = await AsyncStorage.getItem("isAuthenticated");
    return value ? JSON.parse(value) : false;
  } catch (error) {
    console.error("Error checking authentication state:", error);
    return false;
  }
};

export const clearAuthState = async () => {
  try {
    await AsyncStorage.removeItem("isAuthenticated");
  } catch (error) {
    console.error("Error clearing authentication state:", error);
  }
};
