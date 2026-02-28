export const ipService = {
  getClientIp: async (): Promise<string> => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch {
      return "0.0.0.0";
    }
  },
};
