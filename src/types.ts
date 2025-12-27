
export interface Product {
    garage: string;
    price: string;
    name: string;
    start_address?: LocationResult;
    end_address?: LocationResult;
    start_time?: string; // ngày đặt
    message?:string;
    phone?:string;
    quantity?: number;
    id?: string;
    status_order?: string
}

export interface Image{
    image_url: string
}
export interface Stop{
    location: LocationResult,
    stop_time: string,
    type: string,
    deleted: boolean
}


export interface ProductManage {
    productID: string;
    license_plates: string;
    description: string;
    phone_number: string;
    phone_number2: string;
    startLocation: LocationResult;
    endLocation: LocationResult;
    start_time: string;     // BE trả LocalTime → FE nhận string
    end_time: string;
    price: string;
    name: string;
    quantity_seat: number;
    policy: string;
    utilities: string;
    type: string;
    createAt: string;        // BE trả Date → FE string
    updateAt: string;
    status: string;
    owner_name: string;
    store_id: number;
    imageDTOS: Image[];
    noticeDTOS: Notice[];
    stopDTOS: Stop[],
    

    trip_id: string;
    travel_date: string;      // LocalDate → FE string
    trip_start_time: string;
    trip_end_time: string;
    trip_price: string;
    remain_seat: number;
    trip_status: string;
    distance: number;
}


export type NotificationColumn = {
    id:string
    productId:string,
    name: string,
    startTime: string,
    licensePlate: string,
    title: string,
    content: string,
    creatAt: string,
    updateAt: string,
    status: string
}

export interface Notice{
    productId: string,
    title: string,
    content: string,
    status: string
}
export interface SignIn {
    email: string;
    password: string;
}

export interface SignUp {
    email: string;
    password: string;
    role: string,
    phone_number: string,
    username: string
}

export interface UserInfor{
    username: String,
    password: String,
    email: String,
    phone: String,
    role: String
}

export interface LocationResult {
    name: string,
    lat: number,
    lng: number
};

export interface SearchRequest{
    key: string,
    from_city: string,
    to_city: string,
    start_time: string,
    date: string,
    start_address: LocationResult | null,
    end_address: LocationResult | null,
    userLocation: LocationResult | null
}