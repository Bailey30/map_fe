import { MapState } from "@/redux/slice";

export type Review = {
  id: string | number;
  createdAt: string;
  updatedAt: string;
  price: number;
  comments: string;
  rating: number;
  locationId: number;
  creatorId: number;
  creator?: { username: string };
  imageId?: number;
  location?: Location;
};

export type ReviewRequest = Omit<Review, "id">;

export type Location = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  Review: Review[] | null;
};

export interface LocationData extends Location {
  images: {
    [key: string]: string;
  };
}

export type ServerAction = (
  reviewData: any,
  prevState: any,
  formState: any,
) => Promise<ServerActionResponse>;

export type ServerActionResponse = {
  success: boolean;
  errors:
    | {
        username?: string | undefined;
        password?: string | undefined;
        email?: string | undefined;
      }
    | null
    | any;
  action?: string;
  body?: {
    [key: string]: any;
  };
  redirect?: boolean;
};

export type ReviewData = {
  mapState?: MapState;
  imageData?: string | undefined;
};
export type UpdateReviewData = {
  reviewId: number;
  imageData: string;
};

export type User = {
  id: number;
  email: string;
  username: string;
  password: string;
};

export type NewUser = Omit<User, "id">;

export type GeoJSONFeature = {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    name: string;
    price: number | null;
    locationId: number;
  };
};

export type GeoJSON = {
  type: string;
  features: GeoJSONFeature[];
};

export type PasswordResetCodeResponse = {
  Success: boolean;
  UserId: number;
};
