import { ArrowRight, Check } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { groupsSettingsUseCase } from '@/useCases/groups/groups-settings.useCase';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const defaultValues = {
  groupsQuantity: undefined,
  teamsPerGroup: undefined,
};

const formSchema = z.object({
  groupsQuantity: z.string(),
  teamsPerGroup: z.string(),
});

export default function GroupsConfig() {
  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'all',
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  return (
    <Card className="w-fit mt-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((formData) => {
            groupsSettingsUseCase.execute(formData);
          })}
          className="flex flex-col p-10 gap-4"
        >
          <FormField
            control={form.control}
            name="groupsQuantity"
            render={({ field: { value, onChange, name } }) => (
              <FormItem className="min-w-80">
                <FormLabel>Quantidade de Grupos *</FormLabel>
                <FormControl>
                  <Input
                    key={name}
                    name={name}
                    placeholder="Digite aqui"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="teamsPerGroup"
            render={({ field: { value, onChange, name } }) => (
              <FormItem className="min-w-80">
                <FormLabel>Times por Grupo *</FormLabel>
                <FormControl>
                  <Input
                    key={name}
                    name={name}
                    placeholder="Digite aqui"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="mt-8 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 hover:to-purple-900 py-2"
          >
            Confirmar
            <ArrowRight className="w-5 h-5" />
          </Button>
        </form>
      </Form>
    </Card>
  );
}
