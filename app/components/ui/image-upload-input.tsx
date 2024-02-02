import {useField} from 'remix-validated-form';

import {Button} from '~/components/ui/button';
import {DangerAlert} from '~/components/icons/alert';
import {DEFAULT_IMAGE} from '~/lib/constants/general.constant';
import {EditFormFieldNameType} from '~/routes/_app.promotion_.edit/route';
import {AddTeamFormFieldNameType} from '~/routes/_app.team_.add/team-form';

type ImageUploadInputProps = {
  name: AddTeamFormFieldNameType | EditFormFieldNameType;
  imageUrl: string | undefined;
  className?: string;
  defaultImage?: string;
  unsavedChanges?: any;
};

export default function ImageUploadInput({
  name,
  imageUrl,
  className,
  defaultImage,
  unsavedChanges,
}: ImageUploadInputProps) {
  const {getInputProps, error, clearError} = useField(name);

  const handleProfileImageUpload = () => {
    const profileImageUploadInput = document.getElementById(
      'image-upload',
    ) as HTMLInputElement;
    profileImageUploadInput?.click();

    profileImageUploadInput.addEventListener('change', (event) => {
      const file = (event.target as HTMLInputElement)?.files?.[0];
      if (file) {
        if (file.type.split('/')[0] !== 'image') {
          return;
        }
        const reader = new FileReader();
        reader.onload = function () {
          const imagePreviews = document.querySelectorAll(
            '.image-preview',
          ) as unknown as HTMLImageElement[];
          imagePreviews.forEach((imagePreview) => {
            imagePreview.setAttribute('src', reader.result as string);
          });
        };
        reader.readAsDataURL(file);
        unsavedChanges && unsavedChanges();
      }
    });
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center space-x-4">
        <img
          src={imageUrl ?? defaultImage ?? DEFAULT_IMAGE.DEFAULT}
          alt="image-preview"
          className="object-cover w-16 h-16 border border-solid rounded-full image-preview border-gray_C3C1BF place-content-start"
        />
        <div>
          <input
            type="file"
            accept="image/*"
            {...getInputProps({onChange: () => clearError()})}
            id="image-upload"
            hidden
          />
          <label
            htmlFor="image-upload"
            className="flex items-center text-sm font-normal text-grey-400"
            onClick={(event) => {
              event.preventDefault();
              handleProfileImageUpload();
            }}
          >
            <Button type="button" variant="ghost" className="mr-2">
              upload new picture
            </Button>
            PNG, JPEG under 15MB
          </label>
        </div>
      </div>
      {error && (
        <p className="pt-1 error-msg">
          <DangerAlert />
          <span className="pl-2">{error}</span>
        </p>
      )}
    </div>
  );
}
