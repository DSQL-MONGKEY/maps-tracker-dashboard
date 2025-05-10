'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tracking } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';


const formSchema = z.object({
  deviceName: z.string().min(2, {
    message: 'Device name must be at least 2 characters.'
  }),
  holderName: z.string().min(2, {
    message: 'Holder name must be at least 2 characters'
  }),
  latitude: z.number(),
  longitude: z.number(),
  emergencyStatus: z.boolean(),
});

export default function TrackingsForm({
  initialData,
  pageTitle
}: {
  initialData: Tracking | null;
  pageTitle: string;
}) {
  const defaultValues = {
    deviceName: initialData?.devices.name || '',
    holderName: initialData?.holder_name || '',
    latitude: initialData?.latitude || 0,
    longitude: initialData?.longitude || 0,
    emergencyStatus: initialData?.is_emergency || false
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Form submission logic would be implemented here
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='deviceName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter device name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='holderName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Holder Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter holder name' {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='latitude'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        placeholder='Enter latitude'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='longitude'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        placeholder='Enter longitude'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='emergencyStatus'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Status</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder="Choose status"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={'true'}>
                            True
                          </SelectItem>
                          <SelectItem value={'false'}>
                            False
                          </SelectItem>
                        </SelectContent>
                      </Select>
                  </FormItem>
                )}
              />
            </div>
            <Button type='submit'>Add Tracking Record</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
