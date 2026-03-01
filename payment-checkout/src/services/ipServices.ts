import axios from "axios";

export const ipService = {
  getClientIp: async (): Promise<string> => {
    try {
      const { data } = await axios.get("https://api.ipify.org?format=json");
      return data.ip;
    } catch {
      return "0.0.0.0";
    }
  },
};
