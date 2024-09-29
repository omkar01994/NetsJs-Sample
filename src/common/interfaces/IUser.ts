import Roles from '../enums/Roles';
import IMetaData from './IMetaData';

export default interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  image: string;
  status: string;
  role?: Roles;
  meta: IMetaData;
}
