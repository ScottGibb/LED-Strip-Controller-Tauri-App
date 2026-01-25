export interface ChannelPickerProps {
  channels?: number[];
  selectedChannels?: number[];
  setSelectedChannels?: (channels: number[]) => void;
}

export function ChannelPicker({
  channels = [],
  selectedChannels = [],
  setSelectedChannels = () => {},
}: ChannelPickerProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Led Channel</h1>
      <div>
        <div className="overflow-y-auto max-h-64 border rounded p-2">
          {channels.length === 0 && <NoChannelsAvailable />}
          {channels.length > 0 && (
            <ChannelMenu
              channels={channels}
              selectedChannels={selectedChannels}
              setSelectedChannels={setSelectedChannels}
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface ChannelMenuProps {
  channels: number[];
  selectedChannels: number[];
  setSelectedChannels: (channels: number[]) => void;
}

function ChannelMenu({
  channels,
  selectedChannels,
  setSelectedChannels,
}: ChannelMenuProps) {
  return (
    <div>
      {channels.map((index: number) => (
        <label key={index} className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={selectedChannels.includes(index)}
            onChange={() => {
              if (selectedChannels.includes(index)) {
                setSelectedChannels(
                  selectedChannels.filter((i: number) => i !== index),
                );
              } else {
                setSelectedChannels([...selectedChannels, index]);
              }
            }}
          />
          <span>Channel {index}</span>
        </label>
      ))}
    </div>
  );
}

function NoChannelsAvailable() {
  return <div>No channels available, please check your devices firmware</div>;
}
