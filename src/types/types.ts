export type ClientTokenT = {
  p: string;
  clsvc: string;
  t: string;
  mver: boolean;
  cid: string;
  ic: boolean;
  exp: number;
  am: string;
  iat: number;
  jti: string;
  pfpid: string;
};

export type AccessTokenT = {
  clientId: string;
  role: string;
  productId: string;
  iss: string;
  env: string;
  nonce: string;
  organizationId: string;
  features: string[];
  productUserId: string;
  organizationUserId: string;
  clientIp: string;
  deploymentId: string;
  sandboxId: string;
  tokenType: string;
  exp: number;
  iat: number;
  account: {
    idp: string;
    displayName: string;
    id: string;
    plf: string;
    bnd: boolean;
  };
  jti: string;
  ic: boolean;
  sid: string;
  am: string;
};

export type RefreshTokenT = {
  sub: string;
  pfsid: string;
  iss: string;
  dn: string;
  pfpid: string;
  aud: string;
  pfdid: string;
  t: string;
  appid: string;
  scope: string;
  iat: number;
  jti: string;
};

export type AccountT = {
  accountId: string;
  created: string;
  discordId: string;
  displayName: string;
  email: string;
  password: string;
  banned: boolean;
  buildId: string;
};

export type FNVer = {
  seasonInt: number;
  seasonStr: string;
  versionStr: string;
  versionInt: number;
};

export type ClientInfo = {
  platform: string;
  NT: string;
};

export type HotfixResp = {
  uniqueFilename: string;
  filename: string;
  hash: string;
  hash256: string;
  length: number;
  contentType: string;
  uploaded: Date;
  storageType: string;
  storageIds: Record<string, unknown>;
  doNotCache: boolean;
};

export type variants = {
  active: string;
  channel: string;
  owned: string[];
};

export type slot = {
  templateId: string;
  quantity: number;
  attributes: {
    max_level_bonus: number;
    level: number;
    item_seen: boolean;
    xp: number;
    variants: {
      channel: string;
      active: string;
      owned: string[];
    }[];
    favorite: boolean;
  };
};

export type FriendsResponse = {
  accountId: string;
  status: string;
  direction: string;
  created: string;
  favorite: boolean;
};

export type DiscordServerResp = {
  avatar: string | null;
  banner: string | null;
  communication_disabled_until: string | null;
  flags: number;
  joined_at: string;
  nick: string | null;
  pending: boolean;
  premium_since: string | null;
  roles: string[];
  unusual_dm_activity_until: string | null;
  user: {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    public_flags: number;
    flags: number;
    banner: string;
    accent_color: number;
    global_name: string;
    avatar_decoration_data: {
      asset: string;
      sku_id: string;
      expires_at: number;
    };
    banner_color: string;
    clan: string | null;
    primary_guild: string | null;
  };
  mute: boolean;
  deaf: boolean;
  bio: string;
};
