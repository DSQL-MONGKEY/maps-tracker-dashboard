'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useMapSelectionStore } from "@/stores/map-selection-state";
import { useTrackingStore } from "@/stores/trackings";


const formSchema = z.object({
   fromDevice: z.string().min(2, 'From device is required.'),
   toDevice: z.string().min(2, 'To device is required.'),
   latestMode: z.boolean().default(false)
});

export default function DistanceFormSelector() {
   const { filteredTrackings } = useTrackingStore();
   const { 
      latestMode, 
      setLatestMode,
      setFromId,
      setToId,
      clearSelection,
   } = useMapSelectionStore();
   

   
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         fromDevice: '',
         toDevice: '',
         latestMode: false
      }
   })

   function onSubmit(values: z.infer<typeof formSchema>) {
      // Handle form submission logic here
      setFromId(values.fromDevice);
      setToId(values.toDevice);
   }

   function handleSwitchChange() {
      setLatestMode(!latestMode);
   }

   return (
      <Card className="mx-auto w-full">
         <CardHeader>
            <CardTitle className="text-left text-xl font-bold">
               Check Distance Between Devices
            </CardTitle>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-2 gap-6 md:grid-cols-2 px-2">

                     <div className="col-span-2">
                     <FormField
                        control={form.control}
                        name="latestMode"
                        render={() => (
                           <FormItem>
                              <FormLabel>Latest data</FormLabel>
                              <FormControl>
                                 <Switch
                                    checked={!latestMode}
                                    onCheckedChange={handleSwitchChange}
                                    id="latestMode"
                                 />
                              </FormControl>
                           </FormItem>
                        )}
                     />
                     </div>

                     <FormField
                        control={form.control}
                        name="fromDevice"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>From Device</FormLabel>
                              <Select
                                 onValueChange={(value) => field.onChange(value)}
                                 value={field.value}
                                 disabled={latestMode}
                              >
                                 <FormControl>
                                    <SelectTrigger>
                                       <SelectValue placeholder="Choose device" />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    {filteredTrackings.map((track) => (
                                       <SelectItem 
                                          value={track.id} 
                                          key={track.id}
                                       >
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
                                 value={field.value}
                                 disabled={latestMode}
                              >
                                 <FormControl>
                                    <SelectTrigger>
                                       <SelectValue placeholder="Choose device" />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    {filteredTrackings.map((track) => (
                                       <SelectItem 
                                          value={track.id} 
                                          key={track.id}
                                       >
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
                  
                  <div className="flex gap-4">
                     <Button type="submit" className="" disabled={latestMode}>
                        Check Distance
                     </Button>
                           
                     <Button 
                        type="button"
                        onClick={() => clearSelection()} className="bg-cyan-500" disabled={latestMode}>
                        Clear Selection
                     </Button>
                  </div>
               </form>
            </Form>
         </CardContent>
      </Card>
   )
}