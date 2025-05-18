import { Skeleton } from "../skeleton";

export function MapSkeleton() {
   return (
      <div className="flex w-full h-[500px]">
         <Skeleton
            className="w-full h-full rounded-md"
         />
      </div>
   )
}