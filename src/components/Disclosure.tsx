import { Disclosure as HeadlessDisclosure } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';

const Disclosure = () => {
  return (
    <div className="w-full px-4 pt-4">
      <div className="w-full rounded-2xl bg-white p-2">
        <HeadlessDisclosure>
          {({ open }) => (
            <>
              <HeadlessDisclosure.Button className="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                <span>What is your refund policy?</span>
                <ChevronUpDownIcon
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-blue-500`}
                />
              </HeadlessDisclosure.Button>
              <HeadlessDisclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                If you're unhappy with your purchase for any reason, email us
                within 90 days and we'll refund you in full, no questions asked.
              </HeadlessDisclosure.Panel>
            </>
          )}
        </HeadlessDisclosure>
        <HeadlessDisclosure as="div" className="mt-2">
          {({ open }) => (
            <>
              <HeadlessDisclosure.Button className="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                <span>Do you offer technical support?</span>
                <ChevronUpDownIcon
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-blue-500`}
                />
              </HeadlessDisclosure.Button>
              <HeadlessDisclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                No.
              </HeadlessDisclosure.Panel>
            </>
          )}
        </HeadlessDisclosure>
      </div>
    </div>
  );
};

export default Disclosure;
