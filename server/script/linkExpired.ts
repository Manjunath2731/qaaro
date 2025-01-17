import { Link } from "../models/Link.model";

export const deactivateExpiredLinks = async (): Promise<void> => {
    try {
      const expiredLinks = await Link.find({
        expiresAt: { $lte: new Date() },
        active: true
      });

      const promises = expiredLinks.map(async (link) => {
        link.active = false;
        await link.save();
      });
  
      await Promise.all(promises);
      console.log('Expired links deactivated:', expiredLinks.length);
    } catch (error) {
      console.error('Error deactivating expired links:', error);
    }
  };