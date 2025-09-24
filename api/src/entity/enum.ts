export enum USER_TYPE {
  USER = "user",
  VENDOR = "vendor",
  OTHER = "OTHER",
}

export enum VENDOR_VERIFICATION_STATUS {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}


export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "OTHER",
}

export enum BoatType {
  LUXURY = "LUXURY",
  PREMIUM = "PREMIUM",
  DELUXE = "DELUXE",
  STANDARD = "STANDARD",
  OTHER = "OTHER",
}

export enum CustomizationType {
  FIELD = "FIELD",
  TICK = "TICK",
}

  export enum PropertyType {
    TRANSPORTSTION      = "TRANSPORTATION",
    ACCOMODATION  = "ACCOMODATION",
    BACK_WATERS   = "BACK_WATERS",
    SPECIAL_EVENTS   = "SPECIAL_EVENTS",
  }

  export enum MainOptions {
  BasicFacilities         = "Basic Facilities",
  GeneralServices              = "General Services",
  PopulerAmneties      = "Populer Amneties",
  FoodAndDrinks  = "Food and Drinks",
  CommonArea  = "Common Area",
   OTHER = "OTHER",
}

export enum StarRating {
  ONE   = 1,
  TWO   = 2,
  THREE = 3,
  FOUR  = 4,
  FIVE  = 5,
}

 export enum BookingStatus {
  PENDING = "PENDING",      // not yet confirmed/paid
  CONFIRMED = "CONFIRMED",  // booked and paid
  CHECKED_IN = "CHECKED_IN",// guest/vehicle is in use
  COMPLETED = "COMPLETED",  // finished and freed
  CANCELED = "CANCELED",
}


export enum PaymentType {
  ONLINE = 'ONLINE',
  COD    = 'COD',
}

export enum CommissionStatus {
  PENDING = 'PENDING',
  PAID    = 'PAID',
}