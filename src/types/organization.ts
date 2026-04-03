export type OrganizationMember = {
  _id: { $oid: string };
  fullname: string;
  gender: string;
  address: string;
  role: string;
  organizationId: string;
  photo: string;
};

