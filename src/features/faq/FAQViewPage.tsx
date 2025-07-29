/* eslint-disable @typescript-eslint/no-unused-vars */


type TFAQViewPageProps = {
   section: string;
}

export default async function FAQViewPage({ section }: TFAQViewPageProps) {
   let pageTitle = '';

   if(section == 'lora') {
      pageTitle = 'What is LoRa?';
   }

   return (
      {}
   );
}