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
import { ClimberUser } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { addClimber } from '../api/add-climber';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/format';
import { mutate } from 'swr';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.'
  }),
  phone: z.string().min(6, {
    message: 'phone number must be at least 6 characters.'
  }),
  email: z.string().min(5, {
    message: 'Email must be at least 5 characters.'
  }),
  address: z.string().min(5, {
    message: 'Address must be at least 5 characters.'
  })
});

export default function ClimberForm({
  initialData,
  pageTitle
}: {
  initialData: ClimberUser | null;
  pageTitle: string;
}) {
    const router = useRouter();

  const defaultValues = {
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    address: initialData?.address || ''
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await addClimber({...values});

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
      mutate('/api/climber-users');

      router.push('/dashboard/climber-users');
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
          <form onSubmit={form.handleSubmit(onSubmit)} className=' grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Climber Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type='tel'
                      placeholder='081234...'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='Enter email'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Enter address'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className=" mt-5 md:col-span-2">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
