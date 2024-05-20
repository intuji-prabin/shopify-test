import {useField} from 'remix-validated-form';
import {Button} from '~/components/ui/button';
import {DangerAlert} from '~/components/icons/alert';
import {
  AddTeamFormFieldNameType,
  EditTeamFormFieldNameType,
} from '~/routes/_app.team_.add/team-form';
import {EditFormFieldNameType} from '~/routes/_app.edit_.$promotionId/route';

type ImageUploadInputProps = {
  name:
    | AddTeamFormFieldNameType
    | EditTeamFormFieldNameType
    | EditFormFieldNameType;
  imageUrl: string | undefined;
  className?: string;
  defaultImage?: string;
  unsavedChanges?: any;
  handleFile?: any;
};

export default function ImageUploadInput({
  name,
  imageUrl,
  className,
  defaultImage,
  handleFile,
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
        handleFile && handleFile('companyLogo', file);
        unsavedChanges && unsavedChanges();
      }
    });
  };

  return (
    <div className={className}>
      <div className="flex flex-col items-center gap-y-4 sm:flex-row sm:gap-x-4">
        <img
          src={imageUrl ?? defaultImage}
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
            className="flex flex-col items-center w-full text-sm font-normal gap-y-4 text-grey-400 sm:flex-row"
            onClick={(event) => {
              event.preventDefault();
              handleProfileImageUpload();
            }}
          >
            <Button
              type="button"
              variant="ghost"
              className="whitespace-nowrap xs:mr-2"
            >
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
