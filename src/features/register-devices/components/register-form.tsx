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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ClimberUser, Devices, RegisterDevices } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { RegisterDevice } from '../api/add-update-register';
import { toast } from 'sonner';
import useSWR, { mutate } from 'swr';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/format';
import { fetcher } from '@/lib/fetcher';
import { Calendar } from '@/components/ui/calendar';

const formSchema = z.object({
  climberUserId: z.string().min(4,{
    message: 'Device code must be at least 4 characters.'
  }),
  deviceId: z.string().min(2, {
    message: 'Product name must be at least 2 characters.'
  }),
  isActive: z.boolean(),
  registeredAt: z.string().nullable().optional(),
  unregisteredAt: z.string().nullable().optional(),
});

export default function RegisterForm({
  initialData,
  pageTitle,
  method,
}: {
  initialData: RegisterDevices | null;
  pageTitle: string;
  method?: string | null;
}) {
  const router = useRouter();

  const defaultValues = {
    climberUserId: initialData?.climber_user_id || '',
    deviceId: initialData?.device_id || '',
    isActive: initialData?.is_active || true,
    registeredAt: initialData?.registered_at || null,
    unregisteredAt: initialData?.unregistered_at || null,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });

  const { data:climberResponse, error:climberError, isLoading:climberLoading } = useSWR('/api/climber-users', fetcher);

  if(climberLoading) {
    toast('Loading...', {
        description: 'Load climber data'
      });
  }

  if(climberError) {
    toast('Failed...', {
      description: 'Error occured while fetching device data'
    });
  }

  const { data:climberData } = climberResponse ?? [];


  const { data:deviceResponse, error:deviceError, isLoading:deviceLoading } = useSWR('/api/devices', fetcher);
  
    if(deviceLoading) {
      toast('Loading...', {
        description: 'Load device data'
      });
    }
  
    if(deviceError) {
      toast('Failed...', {
        description: 'Error occured while fetching device data'
      });
    }
  
    const { data:deviceData } = deviceResponse ?? [];


  async function onSubmit(values: z.infer<typeof formSchema>) {

    try {
      const response = await RegisterDevice(
        {...values}, 
        initialData?.id ?? '', 
        method ?? 'POST'
      );

      const { data } = await response;

      const formattedDate = method == 'PUT' ? (
        formatDate(data.updated_at,  {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: false,
        })
      ) : (
        formatDate(data[0].created_at,  {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: false,
        })
      );


      toast('Request successfully', {
        duration: 5000,
        description: formattedDate,
      });

      mutate('/api/register-device');
      router.push('/dashboard/register-device');

    } catch(error) {
      if(error instanceof Error) {
        toast('Error request failed ', {
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
                name='climberUserId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Climber User</FormLabel>
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
                          {climberData?.map((climber: ClimberUser) => (
                          <SelectItem 
                            key={climber.id}
                            value={climber.id}
                          >
                            {climber.name}
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
                name='deviceId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device Name</FormLabel>
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
                            {deviceData?.map((device: Devices) => (
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
                name='isActive'
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
            </div>
            <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='registeredAt'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Register Date</FormLabel>
                    <FormControl>
                      <Calendar
                        mode='single'
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          if (!date) {
                            field.onChange(null);
                            return;
                          }
                          const now = new Date();
                          date.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

                          field.onChange(date.toISOString());
                        }}
                        initialFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='unregisteredAt'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unregister Date</FormLabel>
                    <FormControl>
                      <Calendar
                        mode='single'
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          if (!date) {
                            field.onChange(null);
                            return;
                          }
                          const now = new Date();
                          date.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

                          field.onChange(date.toISOString());
                        }}
                        initialFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type='submit'>Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
