import axiosInstance from "@/lib/config-axios";
import { z } from "zod";

const formSchema = z.object({
    name: z.string().min(2),
    startLocation: z.object({ name: z.string(), lat: z.number(), lng: z.number() }),
    endLocation: z.object({ name: z.string(), lat: z.number(), lng: z.number() }),
    stopDTOS: z.array(z.object({
        location: z.object({ name: z.string(), lat: z.number(), lng: z.number() }),
        stopTime: z.string(),
        type: z.enum(["PICKUP", "DROPOFF"]),
        deleted: z.boolean()
    })).optional(),
    images: z.object({ image_url: z.string() }).array(),
    start_time: z.string().min(1),
    end_time: z.string().min(1),
    license_plates: z.string().min(1),
    phone_number: z.string().min(1),
    phone_number2: z.string().min(1),
    description: z.string().min(1),
    policy: z.string().min(1),
    price: z.number().or(z.string()),
    quantity_seat: z.number().or(z.string()),
    type: z.string().min(1),
    utilities: z.string().min(1),
    status: z.string().default("Hiện")
})

export type ProductFormValues = z.infer<typeof formSchema>;
const API_URL = `/common/get-product`;

const getProductById = async (id: string): Promise<ProductFormValues> => {
    try {
        const res = await axiosInstance.get(`${API_URL}/${id}`);
        const product = res?.data;

        // Normalize dữ liệu để phù hợp với form
        return {
            name: product.name || "",
            startLocation: product.startLocation
                ? { name: product.startLocation.name, lat: product.startLocation.lat, lng: product.startLocation.lng }
                : { name: "", lat: 0, lng: 0 },
            endLocation: product.endLocation
                ? { name: product.endLocation.name, lat: product.endLocation.lat, lng: product.endLocation.lng }
                : { name: "", lat: 0, lng: 0 },
            stopDTOS: product.stopList?.map((stop: any) => ({
                location: stop.location ? { name: stop.location.name, lat: stop.location.lat, lng: stop.location.lng } : { name: "", lat: 0, lng: 0 },
                stopTime: stop.stopTime || "",
                type: stop.type || "PICKUP",
                deleted: stop.deleted ?? false,
            })) || [],
            images: product.images?.map((img: any) => ({ image_url: img.image_url || img.url })) || [],
            start_time: product.start_time ? product.start_time.substring(0, 5) : "",
            end_time: product.end_time ? product.end_time.substring(0, 5) : "",
            license_plates: product.license_plates || "",
            phone_number: product.phone_number || "",
            phone_number2: product.phone_number2 || "",
            description: product.description || "",
            policy: product.policy || "",
            price: product.price ?? 0,
            quantity_seat: product.quantity_seat ?? 0,
            type: product.type || "",
            utilities: product.utilities || "",
            status: product.status || "Hiện"
        };
    } catch (err) {
        throw err;
    }
}

export default getProductById;
