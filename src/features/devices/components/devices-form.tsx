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
import { Textarea } from '@/components/ui/textarea';
import { Devices } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { addDevice } from '../api/add-devices';
import { toast } from 'sonner';
import { mutate } from 'swr';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/format';

const formSchema = z.object({
  deviceCode: z.string().min(4,{
    message: 'Device code must be at least 4 characters.'
  }).max(8, {
    message: 'Device code must not exceed 8 characters.'
  }),
  name: z.string().min(2, {
    message: 'Product name must be at least 2 characters.'
  }),
  status: z.boolean(),
  type: z.string(),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.'
  })
});

export default function DeviceForm({
  initialData,
  pageTitle
}: {
  initialData: Devices | null;
  pageTitle: string;
}) {
  const router = useRouter();

  const defaultValues = {
    deviceCode: initialData?.device_code || '',
    name: initialData?.name || '',
    status: initialData?.status || true,
    type: initialData?.type || '',
    description: initialData?.description || '',
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await addDevice({...values});
      const { data } = await response;

      toast('Record has been added successfully', {
        duration: 5000,
        description: formatDate(data[0].created_at,  {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: false,
        }),
      });
      mutate('/api/devices');
    
      router.push('/dashboard/devices');
    } catch(error) {
      if(error instanceof Error) {
        toast('Error failed to add record', {
          duration: 3000,
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
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='deviceCode'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device Code</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter device code' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='name'
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
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device Status</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Boolean(value))}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select device status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={'true'}>
                          Active
                        </SelectItem>
                        <SelectItem value={'false'}>
                          Inactive
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select device type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={'base-station'}>
                          Base Station
                        </SelectItem>
                        <SelectItem value={'client-device'}>
                          Client Device
                        </SelectItem>
                        <SelectItem value={'extender-device'}>
                          Extender Device
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter the device description'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit'>Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
