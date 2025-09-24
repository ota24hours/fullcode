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


export const getUserById = async (req: Request, res: Response) => {
  try {
    // 1) Pull the ID from the route
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return errorResponse(res, 'Invalid user ID');
    }

    // 2) Build QueryBuilder on User ("u")
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.user_support_docs', 'usd')
      .select([
        'u.id',
        'u.name',
        'u.phone',
        'u.email',
        'u.status',
        'u.user_type',
        'u.verified_status',
        'u.profile_url',
        'u.createdAt',
        'u.updatedAt',
        'usd.id',
        'usd.doc_type',
        'usd.doc_one',
        'usd.expiry_date',
        'u.district','u.state','u.country','u.address','u.gender','u.date_of_birth',
      ])
      .where('u.id = :id', { id })
      .getOne();

    if (!user) {
      return errorResponse(res, 'User not found');
    }

    // 3) Prefix all image/document URLs
    const BASE = process.env.IMAGE_BASE_URL?.replace(/\/+$/, '') || '';
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

    // 4) Return
    return toJson(res, { data: user });

  } catch (error: any) {
    return errorResponse(res, error.message || error);
  }
};