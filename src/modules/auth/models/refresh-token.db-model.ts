import {ObjectId} from "mongodb";

export type RefreshTokenDbModel = {
    _id: ObjectId;

    // ID пользователя, которому была выдана сессия.
    userId: string;

    // Уникальный идентификатор JWT из поля jti.
    tokenId: string;

    issuedAt: Date;
    expiresAt: Date;

    // null — токен ещё активен.
    // Date — токен уже использован или отозван.
    revokedAt: Date | null;
};


export type RefreshTokenInsertModel = Omit<RefreshTokenDbModel, "_id">;
