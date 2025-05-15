import { handlers } from "@/auth";

export const { GET, POST } = handlers;

// Ensure proper error handling
export async function handleError(req, res) {
  try {
    const result = await handlers[req.method](req, res);
    return result;
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}