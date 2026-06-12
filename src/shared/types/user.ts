export type UserStatus = 'online' | 'away' | 'offline';
// Памятка: маппинг на схему User с бэка (заполнится мапером при интеграции)
//   id       <- id
//   username <- name           (уникальный тег/хендл, напр. "@username")
//   name     <- display_name   (отображаемое имя, напр. "Necke")
//   avatar   <- avatar.url     (бэк отдаёт File-объект {url, name, sizeb, type, ...}, фронт берёт url)
//   status   <- status         (бэк отдаёт произвольную строку, фронт сужает до UserStatus)
//
// email/password/created_at/updated_at с бэка - в чате не используются
export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  status: UserStatus;
}
