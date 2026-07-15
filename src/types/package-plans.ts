export type PackagePlanFeatureValue = boolean | string | number | null;

export interface PackagePlan {
  id: string;
  name: string;
  description: string | null;
  billingModel: string;
  billingInterval: string;
  planPrice: string;
  commissionType: string | null;
  commissionPercentage: string | null;
  commissionFixedAmount: string | null;
  commissionCapAmount: string | null;
  vatPercentage: string | null;
  payoutCycle: string | null;
  termsDocumentUrl: string | null;
  currency: string;
  trialDays: number;
  features: Record<string, PackagePlanFeatureValue>;
  isActive?: boolean;
  isDefault: boolean;
}
