import { Request, Response } from "express";
import {
  cToBooleanSafe,
  errorResponse,
  hasData,
  toJson,
} from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { getPaginationValues } from "../../../../utils/pagination";
import { User } from "../../../../src/entity/user";
import { Db } from "typeorm";

export const GetUserList = async (
  req: Request,
  res: Response
) => {
  try {
    // 1) Parse page‐number from URL (e.g. /api/users/list/:page)
    const pagination = getPaginationValues(req.params.page);

    // 2) Extract optional user_type filter from query (e.g. ?user_type=MEMBER)
    const { user_type ,verified_type,search,user_id } = req.query;

    // 3) Build QueryBuilder on User ("u")
   const userRepo = AppDataSource.getRepository(User);
    const qb = userRepo
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.user_support_docs', 'usd')
      .select([
        'u.id', 'u.name', 'u.phone', 'u.email', 'u.status', 'u.user_type', 'u.verified_status', 'u.profile_url',
        'usd.id', 'usd.doc_type', 'usd.doc_one', 'usd.expiry_date','u.createdAt',          // ← ADDED
        'u.updatedAt','u.district','u.state','u.country','u.address','u.gender','u.date_of_birth',
      ]);

    // Apply filters
    if (user_type) {
      qb.andWhere('u.user_type = :user_type', { user_type });
    }
     if (user_id) {
      qb.andWhere('u.id = :user_id', { user_id });
    }
    if (verified_type) {
      qb.andWhere('u.verified_status = :verified_type', { verified_type });
    }
    if (search) {
      qb.andWhere(
        '(u.name LIKE :search OR u.phone LIKE :search OR u.email LIKE :search)',
        { search: `%${search}%` }
      );
    }

  
       const [users, total] = await qb
      .orderBy('u.createdAt', 'DESC')
      .skip(pagination.skip)
      .take(pagination.limit)
      .getManyAndCount();

    const BASE = process.env.IMAGE_BASE_URL?.replace(/\/+$/, '') || '';
    // Prefix URLs
    const result = users.map(user => {
      if (user.profile_url) {
        const slash = user.profile_url.startsWith('/') ? '' : '/';
        user.profile_url = `${BASE}${slash}${user.profile_url}`;
      }
      user.user_support_docs = user.user_support_docs.map(doc => {
        if (doc.doc_one) {
          const slash = doc.doc_one.startsWith('/') ? '' : '/';
          doc.doc_one = `${BASE}${slash}${doc.doc_one}`;
        }
        return doc;
      });
      return user;
    });
        return toJson(res, { data: { result, total, limit: pagination.limit } });

  } catch (error) {
    errorResponse(res, error);
  }
};