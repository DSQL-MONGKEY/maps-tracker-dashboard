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
import { Devices, Tracking } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { addTracking } from './api/add-tracking';
import { toast } from 'sonner';
import { formatDate } from '@/lib/format';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

const formSchema = z.object({
  deviceId: z.string().min(2, {
    message: 'Device name must be at least 2 characters.'
  }),
  holderName: z.string().min(2, {
    message: 'Holder name must be at least 2 characters'
  }),
  latitude: z.coerce.number()
  .min(-90, {
    message: 'Latitude must be ≥ -90'
  }).max(90, {
    message: 'Latitude must be ≤ 90'
  }),
  longitude: z.coerce.number()
  .min(-180, {
    message: 'Longitude must be ≥ -180'
  })
  .max(180, {
    message: 'Longitude must be ≤ 180'
  }),
  emergencyStatus: z.boolean(),
});

export default function TrackingsForm({
  initialData,
  pageTitle
}: {
  initialData: Tracking | null;
  pageTitle: string;
}) {
  const router = useRouter();

  const defaultValues = {
    deviceId: initialData?.devices.name || 'Choose Device',
    holderName: initialData?.climber_users?.name || '',
    latitude: initialData?.latitude || 0,
    longitude: initialData?.longitude || 0,
    emergencyStatus: initialData?.is_emergency || false
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });


  const { data:response, error } = useSWR('/api/devices', fetcher);

  if(error) {
    toast('Failed...', {
      description: 'Error occured while fetching device data'
    });
  }

  const { data } = response ?? [];


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await addTracking({...values});
      
      const result = await response;
      
      if(!result.success) {
        toast('Request Failed', {
          duration: 4000,
          description: result.error || 'An error occurred while adding tracking record',
        });
        return;
      }

      const data = await response.data;

    toast('Request sent successfully', {
      description: formatDate(data[0].created_at,  {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      }),
    });

    router.push('/dashboard/trackings');

    } catch(error) {
      if(error instanceof Error) {
        toast('Error failed to add record', {
        description: error.message,
        action: {
          label: "Close",
          onClick: () => null 
        },
      });
      }
    }
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
            <div className='grid grid-cols-2 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='deviceId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder='Choose Device'
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position='popper' className='h-32 '>
                          {data?.map((device: Devices) => (
                          <SelectItem 
                            key={device.id}
                            value={device.id}
                          >
                            {device.name}
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
                name='holderName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Holder Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter holder name' {...field} />
                    </FormControl>
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
                        onValueChange={(value) => field.onChange(Boolean(value))}
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
