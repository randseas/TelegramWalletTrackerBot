import { InlineKeyboardMarkup } from "node-telegram-bot-api";

export const START_MENU: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      { text: "🔮 Ekle", callback_data: "add" },
      { text: "🔧 Yönet", callback_data: "manage" },
    ],
    [{ text: "⚙️ Ayarlar", callback_data: "settings" }],
    [{ text: "❔ Nasıl kullanılır", callback_data: "help" }],
  ],
};
export const SUB_MENU: InlineKeyboardMarkup = {
  inline_keyboard: [[{ text: "🔙 Geri", callback_data: "back_to_main_menu" }]],
};
export const TX_SUB_MENU: InlineKeyboardMarkup = {
  inline_keyboard: [[{ text: "Btn123" }]],
};
export const createTxSubMenu = (tokenSymbol: string, tokenMint: string) => {
  const txSubMenu: InlineKeyboardMarkup = {
    inline_keyboard: [
      [
        {
          text: `🐴 Buy on Trojan: ${tokenSymbol}`,
          url: `https://t.me/solana_trojanbot?start=r-handicatbt-${tokenMint}`,
        },
      ],
      [
        {
          text: `🐶 BonkBot: ${tokenSymbol}`,
          url: `https://t.me/bonkbot_bot?start=ref_3au54_ca_${tokenMint}`,
        },
        {
          text: `🐸 PepeBoost: ${tokenSymbol}`,
          url: `https://t.me/pepeboost_sol_bot?start=ref_03pbvu_ca_${tokenMint}`,
        },
      ],
    ],
  };
  return txSubMenu;
};
export const MANAGE_SUB_MENU: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      { text: "🔮 Ekle", callback_data: "add" },
      { text: "🗑️ Sil", callback_data: "delete" },
    ],
    [
      { text: "🔃 Güncelle", callback_data: "update" },
      { text: "✒️ Düzenle", callback_data: "edit" },
    ],
    [{ text: "🔙 Geri", callback_data: "back_to_main_menu" }],
  ],
};
export const USER_SETTINGS_MENU: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      {
        text: "⏸️ Botu başlat/duraklat",
        callback_data: "pause-resume-bot",
      },
    ],
    [{ text: "🔙 Geri", callback_data: "back_to_main_menu" }],
  ],
};
export const USER_WALLET_SUB_MENU: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      {
        text: "🔑 Show private key",
        callback_data: "show_private_key",
      },
    ],
    [{ text: "🔙 Geri", callback_data: "back_to_main_menu" }],
  ],
};
