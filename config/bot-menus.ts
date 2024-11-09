import { InlineKeyboardMarkup } from "node-telegram-bot-api";

export const START_MENU: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      { text: "🔮 Ekle", callback_data: "add" },
      { text: "🔧 Yönet", callback_data: "manage" },
    ],
    [
      { text: "❔ Nasıl kullanılır", callback_data: "help" },
      { text: "⚙️ Ayarlar", callback_data: "settings" },
    ],
  ],
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
export const ADD_SUB_MENU: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      { text: "🔙 Geri", callback_data: "back_to_manage_menu" },
      { text: "🗑️ Sil", callback_data: "delete" },
    ],
    [
      { text: "🔃 Güncelle", callback_data: "update" },
      { text: "✒️ Düzenle", callback_data: "edit" },
    ],
    [{ text: "🏠 Ana sayfaya dön", callback_data: "back_to_main_menu" }],
  ],
};
export const REMOVE_SUB_MENU: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      { text: "🔮 Ekle", callback_data: "add" },
      { text: "🔙 Geri", callback_data: "back_to_manage_menu" },
    ],
    [
      { text: "🔃 Güncelle", callback_data: "update" },
      { text: "✒️ Düzenle", callback_data: "edit" },
    ],
    [{ text: "🏠 Ana sayfaya dön", callback_data: "back_to_main_menu" }],
  ],
};
export const UPDATE_SUB_MENU: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      { text: "🔮 Ekle", callback_data: "add" },
      { text: "🗑️ Sil", callback_data: "delete" },
    ],
    [
      { text: "🔙 Geri", callback_data: "back_to_manage_menu" },
      { text: "✒️ Düzenle", callback_data: "edit" },
    ],
    [{ text: "🏠 Ana sayfaya dön", callback_data: "back_to_main_menu" }],
  ],
};
export const EDIT_SUB_MENU: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      { text: "🔮 Ekle", callback_data: "add" },
      { text: "🗑️ Sil", callback_data: "delete" },
    ],
    [
      { text: "🔃 Güncelle", callback_data: "update" },
      { text: "🔙 Geri", callback_data: "back_to_manage_menu" },
    ],
    [{ text: "🏠 Ana sayfaya dön", callback_data: "back_to_main_menu" }],
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
