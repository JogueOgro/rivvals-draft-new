import { useStore } from 'effector-react';
import { ArrowRight, Check } from 'lucide-react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import draftStore from '@/store/draft/draft-store';
import { generateDraftUseCase } from '@/useCases/draft/generate-draft.useCase';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const defaultValues = {
  name: undefined,
  teamPlayersQuantity: undefined,
  teamsQuantity: undefined,
  isSmartCaptainSelection: true,
};

const formSchema = z.object({
  name: z.string().min(1, '* Campo obrigatório'),
  teamPlayersQuantity: z.string(),
  teamsQuantity: z.string(),
  isSmartCaptainSelection: z.boolean(),
});

export default function DraftConfig() {
  const { config } = useStore(draftStore);
  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'all',
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    form.reset({});
  }, []);

  const showAlert = () => {
    toast({
      description: 'Configurações do Draft atualizadas',
      title: (
        <div className="flex items-center text-green-700">
          <Check />
          <span className="pl-2 text-bold">Sucesso</span>
        </div>
      ) as any,
    });
  };

  return (
    <div className="w-fit">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((config) => {
            generateDraftUseCase.execute(config, showAlert);
          })}
          className="flex flex-col p-10 gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            defaultValue={config?.name}
            render={({ field: { value, onChange, name } }) => (
              <FormItem className="min-w-80">
                <FormLabel>Nome do Jogo *</FormLabel>
                <FormControl>
                  <Input
                    key={name}
                    name={name}
                    placeholder="Digite aqui"
                    value={value?.toString()}
                    onChange={(event) => onChange(event.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="teamsQuantity"
            defaultValue={config?.teamsQuantity}
            render={({ field: { value, onChange, name } }) => (
              <FormItem className="min-w-80">
                <FormLabel>Quantidade de Times *</FormLabel>
                <FormControl>
                  <Input
                    key={name}
                    name={name}
                    placeholder="Digite aqui"
                    value={value?.toString()}
                    onChange={(event) => onChange(event.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="teamPlayersQuantity"
            defaultValue={config?.teamPlayersQuantity}
            render={({ field: { value, onChange, name } }) => (
              <FormItem className="min-w-80">
                <FormLabel>Players por time *</FormLabel>
                <FormControl>
                  <Input
                    key={name}
                    name={name}
                    placeholder="Digite aqui"
                    value={value?.toString()}
                    onChange={(event) => onChange(event.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            defaultValue={config?.isSmartCaptainSelection}
            name="isSmartCaptainSelection"
            render={({ field: { value, onChange, name } }) => (
              <FormItem className="min-w-80">
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="teamPlayersQuantity"
                      checked={value}
                      onCheckedChange={(e) => onChange(e)}
                    />
                    <label
                      htmlFor="teamPlayersQuantity"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Seleção inteligente de capitães
                    </label>
                  </div>
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
    </div>
  );
}
