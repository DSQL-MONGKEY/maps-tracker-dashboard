'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Tracking } from "./leaflet-maps";
import { Button } from "@/components/ui/button";



const formSchema = z.object({
   fromDevice: z.string().min(2, 'From device is required.'),
   toDevice: z.string().min(2, 'To device is required.'),
});

export default function DistanceFormSelector() {
   const [trackings, setTrackings] = useState<Tracking[]>([]);

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         fromDevice: '',
         toDevice: ''
      }
   })

   function onSubmit(values: z.infer<typeof formSchema>) {
      // Handle form submission logic here
      console.log(values);
   }

   function randomId(idx) {
      return Math.floor(Math.random() * idx);

   }

   useEffect(() => {
      const cached = localStorage.getItem('cached-trackings');
      console.log('Cached data:', cached);
      if(cached) {
         try {
            const parsed: Tracking[] = JSON.parse(cached);
            setTrackings(parsed);
            console.log('Cached data:', trackings);
         } catch {
            localStorage.removeItem('cached-trackings');
         }
      }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
               <div className="grid grid-cols-2 gap-6 md:grid-cols-2">
                  <FormField
                     control={form.control}
                     name="fromDevice"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>From Device</FormLabel>
                           <Select
                              onValueChange={(value) => field.onChange(value)}
                              value={field.value}
                           >
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue placeholder="Choose device" />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 {trackings.map((track, index) => (
                                    <SelectItem value={track.device_id} key={`${randomId(index)}`}>
                                       {track.devices.name}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="toDevice"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>To Device</FormLabel>
                           <Select
                              onValueChange={(value) => field.onChange(value)}
                              value={field.value[field.value.length -1]}
                           >
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue placeholder="Choose device" />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 {trackings.map((track, index) => (
                                    <SelectItem value={track.device_id} key={`${index}-${randomId(index)}`}>
                                       {track.devices.name}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>
               <Button type="submit" className="w-full md:w-1/4">
                  Calculate Distance
               </Button>
            </form>
         </Form>
      </>
   )
}