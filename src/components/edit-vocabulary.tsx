"use client";

import React from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Check, Loader2Icon, XIcon } from "lucide-react";
import { Button } from "./button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

import { ScrollArea } from "./ui/scroll-area";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
  FormDescription,
} from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { insertVocabSchema, InsertVocabType } from "@/lib/validation";
import { useAuth } from "@clerk/nextjs";
import { revalidate } from "@/lib/actions";
import { GetQueryResponseType } from "@/types/type";
import useFetch from "@/hooks/use-fetch";
import toast from "react-hot-toast";

type EditVocabularyProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: GetQueryResponseType;
};

const EditVocabulary: React.FC<EditVocabularyProps> = ({
  open,
  setOpen,
  data,
}) => {
  const request = useFetch();
  const uniqueId = React.useId();
  const { userId } = useAuth();
  const [openChapter, setOpenChapter] = React.useState(false);
  const [addExample, setAddExample] = React.useState(
    data.sentenceEx ? true : false
  );
  const [addPredicate, setAddPredicate] = React.useState(
    data.predicate ? true : false
  );
  const [isRegular, setIsRegular] = React.useState(data.isRegular === 1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedChapter, setSelectedChapter] = React.useState<
    undefined | number
  >(data.chapter ?? undefined);
  const form = useForm<InsertVocabType>({
    resolver: zodResolver(insertVocabSchema),
    defaultValues: {
      hangeul: data.hangeul,
      translation: data.translation,
      note: data.note ?? "",
      sentenceEx: data.sentenceEx ?? "",
      translationEx: data.translationEx ?? "",
      reference: data.reference ?? "",
      chapter: data.chapter ?? undefined,
      isRegular: data.isRegular === 1,
      predicate: data.predicate ?? "",
    },
  });

  function onChapterSelect(value: number) {
    const storedValue = form.getValues("chapter");

    if (value === storedValue) {
      setSelectedChapter(() => {
        form.setValue("chapter", undefined);
        setOpenChapter(false);
        return undefined;
      });
    } else {
      setSelectedChapter(() => {
        form.setValue("chapter", value);
        setOpenChapter(false);
        return value;
      });
    }
  }

  function onSwitchChange() {
    setAddExample((prevState) => !prevState);
    form.resetField("sentenceEx");
    return form.resetField("translationEx");
  }

  function onSwitchConjugationChange() {
    setAddPredicate((prevState) => !prevState);
    form.resetField("predicate");
    form.resetField("isRegular");
    return setIsRegular(true);
  }

  function onSwitchRegularChange() {
    return setIsRegular((prevState) => {
      form.setValue("isRegular", !prevState);
      return !prevState;
    });
  }

  async function onSubmit(values: InsertVocabType) {
    try {
      console.time("update");
      setIsLoading(true);
      const axiosRequest = await request();
      await axiosRequest.put(
        `/vocabularies/${data.id}`,
        Object.assign(values, {
          authorId: userId,
          hangeul: values.hangeul || undefined,
          translation: values.translation || undefined,
          note: values.note || undefined,
          sentenceEx: values.sentenceEx || undefined,
          translationEx: values.translationEx || undefined,
          reference: values.reference || undefined,
          chapter: values.chapter,
          isRegular: values.isRegular,
          predicate: values.predicate || undefined,
        })
      );

      await revalidate("vocabularies");
      toast.success("Berhasil menyunting", { duration: 2500 });
    } catch (error: any) {
      const status = error?.response?.status;
      if (status !== 400) {
        console.log(error);
        toast.error("Terjadi kesalahan");
      } else {
        toast.error("Gagal menambahkan");
      }
    } finally {
      console.timeEnd("update");
      setIsLoading(false);
      setOpen(false);
    }
  }
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/40" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex h-full flex-col divide-y divide-muted bg-white dark:bg-zinc-900 shadow-xl"
                >
                  <div className="h-0 flex-1 overflow-y-auto">
                    <div className="bg-emerald-500 px-4 py-6 sm:px-6">
                      <div className="flex items-center justify-between">
                        <DialogTitle className="text-base font-semibold leading-6 text-white">
                          Edit Kosa Kata
                        </DialogTitle>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="relative rounded-md bg-emerald-500 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XIcon aria-hidden="true" className="h-6 w-6" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-emerald-100">
                          Mulai mengedit kosa kata dengan mengisi informasi yang
                          diperlukan.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="divide-y divide-gray-200 px-4 sm:px-6">
                        <div className="space-y-6 pb-5 pt-6">
                          <FormField
                            control={form.control}
                            name="hangeul"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor="hangeul">Hangeul</FormLabel>
                                <FormControl className="mt-2">
                                  <Input {...field} id="hangeul" />
                                </FormControl>
                                <FormMessage>
                                  {form.formState.errors.hangeul?.message}
                                </FormMessage>
                              </FormItem>
                            )}
                          />
                          <div>
                            <div className="flex gap-2 items-center">
                              <Switch
                                checked={addPredicate}
                                onCheckedChange={onSwitchConjugationChange}
                                id="conjugation"
                              />
                              <Label htmlFor="conjugation">
                                Tambahkan perubahan (oleh sistem)
                              </Label>
                            </div>
                            {addPredicate && (
                              <div className="pl-6 mt-4">
                                <FormField
                                  control={form.control}
                                  name="predicate"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel htmlFor="predicate">
                                        Predikat (KK/KS)
                                      </FormLabel>
                                      <FormControl className="mt-2">
                                        <Input {...field} id="predicate" />
                                      </FormControl>
                                      <FormDescription>
                                        Predikat akan dirubah secara otomatis
                                        oleh sistem (optional)
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <div className="flex items-center gap-2 mt-4">
                                  <Switch
                                    checked={!isRegular}
                                    onCheckedChange={onSwitchRegularChange}
                                    id="isRegular"
                                  />
                                  <Label htmlFor="isRegular">
                                    {isRegular
                                      ? "KK/KS Beraturan"
                                      : "KK/KS Tidak beraturan"}
                                  </Label>
                                </div>
                              </div>
                            )}
                          </div>
                          <FormField
                            control={form.control}
                            name="translation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor="translation">
                                  Arti
                                </FormLabel>
                                <FormControl className="mt-2">
                                  <Input {...field} id="translation" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex flex-col">
                            <div className="flex gap-2 items-center">
                              <Switch
                                checked={addExample}
                                onCheckedChange={onSwitchChange}
                                id="sentenceEx"
                              />
                              <Label htmlFor="sentenceEx">
                                Tambahkan contoh kalimat
                              </Label>
                            </div>

                            {addExample && (
                              <div className="pl-6 mt-4 flex flex-col gap-4">
                                <FormField
                                  control={form.control}
                                  name="sentenceEx"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel htmlFor="sentenceEx">
                                        Contoh Kalimat
                                      </FormLabel>
                                      <FormControl className="mt-2">
                                        <Input
                                          {...field}
                                          value={
                                            field.value === null
                                              ? ""
                                              : field.value
                                          }
                                          id="sentenceEx"
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="translationEx"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel htmlFor="translationEx">
                                        Arti Kalimat
                                      </FormLabel>
                                      <FormControl className="mt-2">
                                        <Input
                                          {...field}
                                          value={
                                            field.value === null
                                              ? ""
                                              : field.value
                                          }
                                          id="translationEx"
                                        />
                                      </FormControl>
                                      <FormDescription>
                                        Masukan arti kalimat (optional)
                                      </FormDescription>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            )}
                          </div>
                          <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor="note">Catatan</FormLabel>
                                <FormControl className="mt-2">
                                  <Textarea
                                    {...field}
                                    value={
                                      field.value === null ? "" : field.value
                                    }
                                    placeholder="cth: digunakan untuk memakai dasi"
                                    id="note"
                                    className="resize-none bg-muted"
                                  />
                                </FormControl>
                                <FormDescription>
                                  Tambahkan catatan pada kosa kata (optional)
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                          <div>
                            <Popover
                              open={openChapter}
                              onOpenChange={setOpenChapter}
                            >
                              <PopoverTrigger asChild>
                                <button className="px-4 flex bg-muted justify-between items-center w-[180px] rounded-md text-sm font-medium transition py-1 text-zinc-700 ring-1 ring-inset ring-zinc-900/10 hover:bg-zinc-900/2.5 hover:text-zinc-900 dark:text-zinc-700 dark:text-zinc-400 dark:ring-white/10 dark:hover:bg-white/5 dark:hover:text-white">
                                  {selectedChapter === undefined
                                    ? "Pilih Bab"
                                    : selectedChapter}
                                  <CaretSortIcon />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[90px]">
                                <ScrollArea className="h-[200px] px-2 flex-col gap-2">
                                  <ul className="w-full">
                                    {Array.from({ length: 60 }).map(
                                      (_, index) => (
                                        <li
                                          className="list-none hover:text-zinc-700 dark:text-zinc-400 w-full"
                                          key={uniqueId + index}
                                        >
                                          <button
                                            onClick={() =>
                                              onChapterSelect(index + 1)
                                            }
                                            className="flex justify-between items-center gap-2 w-full"
                                          >
                                            {index + 1}
                                            {selectedChapter &&
                                              selectedChapter - 1 === index && (
                                                <Check size={14} />
                                              )}
                                          </button>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </ScrollArea>
                              </PopoverContent>
                              <p className="text-muted-foreground text-sm mt-2">
                                Pilih bab kosa kata untuk dikelompokan
                                (optional)
                              </p>
                            </Popover>
                          </div>
                          <FormField
                            control={form.control}
                            name="reference"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor="reference">
                                  Referensi (English)
                                </FormLabel>
                                <FormControl className="mt-2">
                                  <Input
                                    {...field}
                                    value={
                                      field.value === null ? "" : field.value
                                    }
                                    id="reference"
                                  />
                                </FormControl>
                                <FormDescription>
                                  Masukan arti dalam Bahasa Inggris sebagai
                                  referensi (optional)
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 justify-end px-4 py-4">
                    <Button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="h-9 px-5 py-3 rounded-md flex items-center ml-4"
                      variant={"secondary"}
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={isLoading}
                      className="h-9 px-5 py-3 rounded-md flex items-center ml-4"
                    >
                      {isLoading && (
                        <Loader2Icon
                          size={16}
                          className="mr-1 text-gray-200 dark:text-emerald-200 animate-spin"
                        />
                      )}
                      {isLoading ? "Save..." : "Save"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default EditVocabulary;
